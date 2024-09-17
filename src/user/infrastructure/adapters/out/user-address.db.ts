import { Inject } from '@nestjs/common';
import {
	PaginateParameters,
	Pagination,
} from 'src/common/core/common.repository';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserAddressRepository } from 'src/user/application/ports/out/user-address.repository';
import { UserAddress } from 'src/user/domain/user-address.model';
import { UserCredentials } from 'src/user/domain/user-credentials.model';
import { UserProfile } from 'src/user/domain/user-profile.model';
import { UserVisibilitySettings } from 'src/user/domain/user-visibility-settings.model';
import { User } from 'src/user/domain/user.model';

export class UserAddressRepositoryImpl implements UserAddressRepository {
	public constructor(
		@Inject(PrismaService) protected prismaService: PrismaService,
	) {}

	private mapUserAddressToDomain(prisma_model: any): UserAddress {
		if (prisma_model === null || prisma_model === undefined) return null;

		return UserAddress.create(
			prisma_model.id,
			prisma_model.name,
			prisma_model.area,
			prisma_model.sub_area,
			prisma_model.locality,
			prisma_model.latitude.toNumber(),
			prisma_model.longitude.toNumber(),
			prisma_model.country_code,
			prisma_model.main,
			User.create(
                prisma_model.user.id,
                UserProfile.create(
                    prisma_model.user.id,
                    prisma_model.user.profile.birth_date,
                    prisma_model.user.profile.display_name,
                    prisma_model.user.profile.theme_color,
                    prisma_model.user.profile.profile_picture,
                    prisma_model.user.profile.banner_picture,
                    prisma_model.user.profile.biograph,
                    prisma_model.user.profile.visibility
                ),
                UserCredentials.create(
                    prisma_model.user.id,
                    prisma_model.user.credentials.name,
                    prisma_model.user.credentials.email,
                    prisma_model.user.credentials.password,
                    prisma_model.user.credentials.phone_number,
                    prisma_model.user.credentials.last_login,
                    prisma_model.user.credentials.last_logout,
                ),
                UserVisibilitySettings.create(
                    prisma_model.user.id,
                    prisma_model.user.visibility_settings.profile,
                    prisma_model.user.visibility_settings.addresses,
                    prisma_model.user.visibility_settings.spot_folders,
                    prisma_model.user.visibility_settings.visited_spots,
                    prisma_model.user.visibility_settings.posts,
                    prisma_model.user.visibility_settings.favorite_spots,
                    prisma_model.user.visibility_settings.favorite_spot_folders,
                    prisma_model.user.visibility_settings.favorite_spot_events,
                ),
                prisma_model.user.status,
                prisma_model.user.created_at,
                prisma_model.user.updated_at,
                prisma_model.user.is_deleted
			),
			prisma_model.created_at,
			prisma_model.updated_at,
			prisma_model.is_deleted,
		);
	}

	public async paginate(
		params: PaginateParameters,
	): Promise<Pagination<UserAddress>> {
		let query = `SELECT id FROM user_addresses`;

		if (params.filters) {
			if (typeof params.filters['userId'] === 'string') {
				const userId = params.filters['userId'];
				if (query.includes('WHERE')) {
					query = `${query} AND user_id = '${userId}'`;
				} else {
					query = `${query} WHERE user_id = '${userId}'`;
				}
			}

			if (typeof params.filters['main'] === 'boolean') {
				const main = params.filters['main'];
				if (query.includes('WHERE')) {
					query = `${query} AND main = ${main}`;
				} else {
					query = `${query} WHERE main = ${main}`;
				}
			}

			if (typeof params.filters['name'] === 'string') {
				const name = params.filters['name'];
				if (query.includes('WHERE')) {
					query = `${query} AND LOWER(name) LIKE '%${name.toLowerCase()}%'`;
				} else {
					query = `${query} WHERE LOWER(name) LIKE '%${name.toLowerCase()}%'`;
				}
			}

			if (typeof params.filters['isDeleted'] === 'boolean') {
				const isDeleted = params.filters['isDeleted'];
				if (query.includes('WHERE')) {
					query = `${query} AND is_deleted = ${isDeleted}`;
				} else {
					query = `${query} WHERE is_deleted = ${isDeleted}`;
				}
			}
		}

		const ids =
			await this.prismaService.$queryRawUnsafe<{ id: string }[]>(query);

		const sort = params.sort ?? 'name';
		const sortDirection = params.sortDirection ?? SortDirection.ASC;

		let orderBy = {};

		switch (sort) {
			case 'created_at':
			case 'createdAt':
				orderBy = { created_at: sortDirection };
				break;
			case 'updated_at':
			case 'updatedAt':
				orderBy = { updated_at: sortDirection };
				break;
			case 'name':
			default:
				orderBy = { name: sortDirection };
				break;
		}

		let items = [];

		const paginate = params.paginate ?? false;
		const page = (params.page ?? 1)-1;
		const limit = params.limit ?? 12;
		const total = ids.length;

		if (paginate) {
			items = await this.prismaService.userAddress.findMany({
				where: { id: { in: ids.map((row) => row.id) } },
				orderBy: orderBy,
				include: {
					user: {
						include: {
							credentials: true,
							visibility_settings: true,
							profile: true,
						},
					},
				},
				skip: limit * page,
				take: limit,
			});
		} else {
			items = await this.prismaService.userAddress.findMany({
				where: { id: { in: ids.map((row) => row.id) } },
				orderBy: orderBy,
				include: {
					user: {
						include: {
							credentials: true,
							visibility_settings: true,
							profile: true,
						},
					},
				},
			});
		}

		items = items.map((i) => {
			return this.mapUserAddressToDomain(i);
		});

		return new Pagination(items, total, page+1, limit);
	}

	public async findBy(values: Object): Promise<Array<UserAddress>> {
		const userId = values['userId'];
		const main = values['main'];
		const name = values['name'];
		const isDeleted = values['isDeleted'] ?? false;

		let query = `SELECT id FROM user_addresses`;

		if (userId) {
			if (query.includes('WHERE')) {
				query = `${query} AND user_id = '${userId}'`;
			} else {
				query = `${query} WHERE user_id = '${userId}'`;
			}
		}

		if (main) {
			if (query.includes('WHERE')) {
				query = `${query} AND main = ${main}`;
			} else {
				query = `${query} WHERE main = ${main}`;
			}
		}

		if (name) {
			if (query.includes('WHERE')) {
				query = `${query} AND LOWER(name) LIKE '%${name.toLowerCase()}%'`;
			} else {
				query = `${query} WHERE LOWER(name) LIKE '%${name.toLowerCase()}%'`;
			}
		}

		if (isDeleted !== undefined) {
			if (query.includes('WHERE')) {
				query = `${query} AND is_deleted = ${isDeleted}`;
			} else {
				query = `${query} WHERE is_deleted = ${isDeleted}`;
			}
		}

		const userAddressIds =
			await this.prismaService.$queryRawUnsafe<{ id: string }[]>(query);

		const userAddresses = await this.prismaService.userAddress.findMany({
			where: { id: { in: userAddressIds.map((row) => row.id) } },
			include: {
				user: {
					include: {
						credentials: true,
						visibility_settings: true,
						profile: true,
					},
				},
			},
		});

		return userAddresses.map((userAddress) => {
			return this.mapUserAddressToDomain(userAddress);
		});
	}

	public async countBy(values: Object): Promise<number> {
		const userId = values['userId'];
		const main = values['main'];
		const name = values['name'];
		const isDeleted = values['isDeleted'] ?? false;

		let query = `SELECT id FROM user_addresses`;

		if (userId) {
			if (query.includes('WHERE')) {
				query = `${query} AND user_id = '${userId}'`;
			} else {
				query = `${query} WHERE user_id = '${userId}'`;
			}
		}

		if (main) {
			if (query.includes('WHERE')) {
				query = `${query} AND main = ${main}`;
			} else {
				query = `${query} WHERE main = ${main}`;
			}
		}

		if (name) {
			if (query.includes('WHERE')) {
				query = `${query} AND LOWER(name) LIKE '%${name.toLowerCase()}%'`;
			} else {
				query = `${query} WHERE LOWER(name) LIKE '%${name.toLowerCase()}%'`;
			}
		}

		if (isDeleted !== undefined) {
			if (query.includes('WHERE')) {
				query = `${query} AND is_deleted = ${isDeleted}`;
			} else {
				query = `${query} WHERE is_deleted = ${isDeleted}`;
			}
		}

		const userAddressIds =
			await this.prismaService.$queryRawUnsafe<{ id: string }[]>(query);

		const count = await this.prismaService.userAddress.count({
			where: { id: { in: userAddressIds.map((row) => row.id) } },
		});

		return count;
	}

	public async findAll(): Promise<Array<UserAddress>> {
		const userAddresses = await this.prismaService.userAddress.findMany({
			include: {
				user: {
					include: {
						credentials: true,
						visibility_settings: true,
						profile: true,
					},
				},
			},
		});

		return userAddresses.map((userAddress) => {
			return this.mapUserAddressToDomain(userAddress);
		});
	}

	public async findById(id: string): Promise<UserAddress> {
		const userAddress = await this.prismaService.userAddress.findFirst({
			where: {
				id: id,
			},
			include: {
				user: {
					include: {
						credentials: true,
						visibility_settings: true,
						profile: true,
					},
				},
			},
		});

		return this.mapUserAddressToDomain(userAddress);
	}

	public async store(model: UserAddress): Promise<UserAddress> {
		const userAddress = await this.prismaService.userAddress.create({
			data: {
				id: model.id(),
				name: model.name(),
				area: model.area(),
				sub_area: model.subArea(),
				latitude: model.latitude(),
				longitude: model.longitude(),
				country_code: model.countryCode(),
				locality: model.locality(),
				main: model.main(),
				created_at: model.createdAt(),
				updated_at: model.updatedAt(),
				user_id: model.user().id(),
			},
			include: {
				user: {
					include: {
						credentials: true,
						visibility_settings: true,
						profile: true,
					},
				},
			},
		});

		return this.mapUserAddressToDomain(userAddress);
	}

	public async update(model: UserAddress): Promise<void> {
		await this.prismaService.userAddress.update({
			where: {
				id: model.id(),
			},
			data: {
				name: model.name(),
				area: model.area(),
				sub_area: model.subArea(),
				locality: model.locality(),
				country_code: model.countryCode(),
				latitude: model.latitude(),
				longitude: model.longitude(),
				main: model.main(),
				created_at: model.createdAt(),
				updated_at: model.updatedAt(),
				is_deleted: model.isDeleted(),
			},
			include: {
				user: {
					include: {
						credentials: true,
						visibility_settings: true,
						profile: true,
					},
				},
			},
		});
	}

	public async delete(id: string): Promise<void> {
		this.prismaService.userAddress.delete({
			where: { id: id },
		});
	}
}
