import { Inject } from '@nestjs/common';
import {
	PaginateParameters,
	Pagination,
} from 'src/common/core/common.repository';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRepository } from 'src/user/application/ports/out/user.repository';
import { UserCredentials } from 'src/user/domain/user-credentials.model';
import { UserProfile } from 'src/user/domain/user-profile.model';
import { UserVisibilitySettings } from 'src/user/domain/user-visibility-settings.model';
import { User } from 'src/user/domain/user.model';

export class UserRepositoryImpl implements UserRepository {
	public constructor(
		@Inject(PrismaService) protected prismaService: PrismaService,
	) {}

	private mapUserToDomain(prisma_model: any): User | null {
		if (prisma_model === null || prisma_model === undefined) return null;

		return User.create(
			prisma_model.id,
			UserProfile.create(
				prisma_model.id,
				prisma_model.profile.birth_date,
				prisma_model.profile.display_name,
				prisma_model.profile.theme_color,
				prisma_model.profile.profile_picture,
				prisma_model.profile.banner_picture,
				prisma_model.profile.biograph,
				prisma_model.profile.visibility
			),
			UserCredentials.create(
				prisma_model.id,
				prisma_model.credentials.name,
				prisma_model.credentials.email,
				prisma_model.credentials.password,
				prisma_model.credentials.phone_number,
				prisma_model.credentials.last_login,
				prisma_model.credentials.last_logout,
			),
			UserVisibilitySettings.create(
				prisma_model.id,
				prisma_model.visibility_settings.profile,
				prisma_model.visibility_settings.addresses,
				prisma_model.visibility_settings.spot_folders,
				prisma_model.visibility_settings.visited_spots,
				prisma_model.visibility_settings.posts,
				prisma_model.visibility_settings.favorite_spots,
				prisma_model.visibility_settings.favorite_spot_folders,
				prisma_model.visibility_settings.favorite_spot_events,
			),
			prisma_model.status,
			prisma_model.created_at,
			prisma_model.updated_at,
			prisma_model.is_deleted
		);
	}

	public async paginate(
		params: PaginateParameters,
	): Promise<Pagination<User>> {
		let query =
			'SELECT users.id FROM users JOIN user_credentials ON user_credentials.user_id = users.id';

		if (params.filters) {
			if (typeof params.filters['name'] === 'string') {
				const name = params.filters['name'];
				if (query.includes('WHERE')) {
					query = `${query} AND LOWER(user_credentials.name) LIKE '%${name.toLowerCase()}%'`;
				} else {
					query = `${query} WHERE LOWER(user_credentials.name) LIKE '%${name.toLowerCase()}%'`;
				}
			}

			if (typeof params.filters['firstName'] === 'string') {
				const firstName = params.filters['firstName'];
				if (query.includes('WHERE')) {
					query = `${query} AND LOWER(users.first_name) LIKE '%${firstName.toLowerCase()}%'`;
				} else {
					query = `${query} WHERE LOWER(users.first_name) LIKE '%${firstName.toLowerCase()}%'`;
				}
			}

			if (typeof params.filters['lastName'] === 'string') {
				const lastName = params.filters['lastName'];
				if (query.includes('WHERE')) {
					query = `${query} AND LOWER(users.last_name) LIKE '%${lastName.toLowerCase()}%'`;
				} else {
					query = `${query} WHERE LOWER(users.last_name) LIKE '%${lastName.toLowerCase()}%'`;
				}
			}

			if (typeof params.filters['fullName'] === 'string') {
				const fullName = params.filters['fullName'];
				if (query.includes('WHERE')) {
					query = `${query} AND LOWER((users.first_name || COALESCE(users.last_name, ''))) LIKE '%${fullName.trim().toLowerCase()}%'`;
				} else {
					query = `${query} WHERE LOWER((users.first_name || COALESCE(users.last_name, ''))) LIKE '%${fullName.trim().toLowerCase()}%'`;
				}
			}

			if (typeof params.filters['status'] === 'string') {
				const status = params.filters['status'];
				if (query.includes('WHERE')) {
					query = `${query} AND users.status = '${status}'`;
				} else {
					query = `${query} WHERE users.status = '${status}'`;
				}
			}

			if (typeof params.filters['isDeleted'] === 'boolean') {
				const isDeleted = params.filters['isDeleted'];

				if (query.includes('WHERE')) {
					query = `${query} AND users.is_deleted = '${isDeleted}'`;
				} else {
					query = `${query} WHERE users.is_deleted = '${isDeleted}'`;
				}
			}
		}

		const ids =
			await this.prismaService.$queryRawUnsafe<{ id: string }[]>(query);

		const sort = params.sort ?? 'name';
		const sortDirection = params.sortDirection ?? SortDirection.ASC;

		let orderBy = {};

		switch (sort) {
			case 'full_name':
			case 'fullName':
			case 'first_name':
			case 'firstName':
				orderBy = { first_name: sortDirection };
				break;
			case 'last_name':
			case 'lastName':
				orderBy = { last_name: sortDirection };
				break;
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
				orderBy = { credentials: { name: sortDirection } };
				break;
		}

		let items = [];

		const paginate = params.paginate ?? false;
		const page = (params.page ?? 1)-1;
		const limit = params.limit ?? 12;
		const total = ids.length;

		if (paginate) {
			items = await this.prismaService.user.findMany({
				where: { id: { in: ids.map((row) => row.id) } },
				orderBy: orderBy,
				include: { credentials: true, visibility_settings: true, profile: true },
				skip: limit * page,
				take: limit,
			});
		} else {
			items = await this.prismaService.user.findMany({
				where: { id: { in: ids.map((row) => row.id) } },
				orderBy: orderBy,
				include: { credentials: true, visibility_settings: true, profile: true },
			});
		}

		items = items.map((i) => {
			return this.mapUserToDomain(i);
		});

		return new Pagination(items, total, page+1, limit);
	}

	public async findBy(values: Object): Promise<Array<User>> {
		const name = values['name'];
		const status = values['status'];
		const isDeleted = values['isDeleted'] ?? false;

		let query =
			'SELECT users.id FROM users JOIN user_credentials ON user_credentials.user_id = users.id';

		if (name) {
			if (query.includes('WHERE')) {
				query = `${query} AND LOWER(user_credentials.name) LIKE '%${name.toLowerCase()}%'`;
			} else {
				query = `${query} WHERE LOWER(user_credentials.name) LIKE '%${name.toLowerCase()}%'`;
			}
		}

		if (status) {
			if (query.includes('WHERE')) {
				query = `${query} AND users.status = '${status}'`;
			} else {
				query = `${query} WHERE users.status = '${status}'`;
			}
		}

		if (isDeleted !== undefined) {
			if (query.includes('WHERE')) {
				query = `${query} AND users.is_deleted = '${isDeleted}'`;
			} else {
				query = `${query} WHERE users.is_deleted = '${isDeleted}'`;
			}
		}

		const userIds =
			await this.prismaService.$queryRawUnsafe<{ id: string }[]>(query);

		const users = await this.prismaService.user.findMany({
			where: {
				id: { in: userIds.map((row) => row.id) },
			},
			include: { credentials: true, visibility_settings: true, profile: true },
		});

		return users.map((user) => {
			return this.mapUserToDomain(user);
		});
	}

	public async countBy(values: Object): Promise<number> {
		const name = values['name'];
		const status = values['status'];
		const isDeleted = values['isDeleted'] ?? false;

		let query =
			'SELECT users.id FROM users JOIN user_credentials ON user_credentials.user_id = users.id';

		if (name) {
			if (query.includes('WHERE')) {
				query = `${query} AND LOWER(user_credentials.name) LIKE '%${name.toLowerCase()}%'`;
			} else {
				query = `${query} WHERE LOWER(user_credentials.name) LIKE '%${name.toLowerCase()}%'`;
			}
		}

		if (status) {
			if (query.includes('WHERE')) {
				query = `${query} AND users.status = '${status}'`;
			} else {
				query = `${query} WHERE users.status = '${status}'`;
			}
		}

		if (isDeleted !== undefined) {
			if (query.includes('WHERE')) {
				query = `${query} AND users.is_deleted = '${isDeleted}'`;
			} else {
				query = `${query} WHERE users.is_deleted = '${isDeleted}'`;
			}
		}

		const userIds =
			await this.prismaService.$queryRawUnsafe<{ id: string }[]>(query);

		const count = await this.prismaService.user.count({
			where: { id: { in: userIds.map((row) => row.id) } },
		});

		return count;
	}

	public async findAll(): Promise<Array<User>> {
		const users = await this.prismaService.user.findMany({
			include: {
				credentials: true,
				visibility_settings: true,
				profile: true,
			},
		});

		return users.map((user): User => {
			return this.mapUserToDomain(user);
		});
	}

	public async findById(id: string): Promise<User> {
		const user = await this.prismaService.user.findFirst({
			where: {
				id: id,
			},
			include: {
				credentials: true,
				visibility_settings: true,
				profile: true,
			},
		});

		return this.mapUserToDomain(user);
	}

	public async findByName(name: string): Promise<User> {
		const user = await this.prismaService.user.findFirst({
			where: {
				credentials: {
					name: name,
				},
			},
			include: {
				credentials: true,
				visibility_settings: true,
				profile: true,
			},
		});

		return this.mapUserToDomain(user);
	}

	public async findByEmail(email: string): Promise<User> {
		const user = await this.prismaService.user.findFirst({
			where: {
				credentials: {
					email: email,
				},
			},
			include: {
				credentials: true,
				visibility_settings: true,
				profile: true,
			},
		});

		return this.mapUserToDomain(user);
	}

	public async store(model: User): Promise<User> {
		const user = await this.prismaService.user.create({
			data: {
				id: model.id(),
				status: model.status(),
				is_deleted: model.isDeleted(),
				created_at: model.createdAt(),
				updated_at: model.updatedAt(),
				credentials: {
					create: {
						name: model.credentials().name(),
						email: model.credentials().email(),
						password: model.credentials().password(),
					},
				},
				profile: {
					create: {
						birth_date: model.profile().birthDate(),
						display_name: model.profile().displayName(),
						theme_color: model.profile().themeColor(),
						profile_picture: model.profile().profilePicture(),
						banner_picture: model.profile().bannerPicture(),
						biograph: model.profile().biograph(),
						visibility: model.profile().visibility(),
					},
				},
				visibility_settings: {
					create: {
						profile: model.visibilitySettings().profile(),
						addresses: model.visibilitySettings().addresses(),
						spot_folders: model
							.visibilitySettings()
							.spotFolders(),
						visited_spots: model
							.visibilitySettings()
							.visitedSpots(),
						posts: model.visibilitySettings().posts(),
						favorite_spots: model
							.visibilitySettings()
							.favoriteSpots(),
						favorite_spot_folders: model
							.visibilitySettings()
							.favoriteSpotFolders(),
						favorite_spot_events: model
							.visibilitySettings()
							.favoriteSpotEvents(),
					},
				},
			},
			include: {
				credentials: true,
				visibility_settings: true,
				profile: true,
			},
		});

		return this.mapUserToDomain(user);
	}

	public async update(model: User): Promise<void> {
		await this.prismaService.user.update({
			data: {
				status: model.status(),
				is_deleted: model.isDeleted(),
				updated_at: model.updatedAt(),
			},
			where: {
				id: model.id(),
			},
			include: {
				credentials: true,
				visibility_settings: true,
				profile: true,
			},
		});
	}

	public async updateCredentials(model: UserCredentials): Promise<void> {
		await this.prismaService.user.update({
			data: {
				credentials: {
					update: {
						where: { user_id: model.id() },
						data: {
							email: model.email(),
							name: model.name(),
							password: model.password(),
							phone_number: model.phoneNumber(),
							last_login: model.lastLogin(),
							last_logout: model.lastLogout(),
						},
					},
				},
			},
			where: {
				id: model.id(),
			},
		});
	}

	public async updateProfile(
		model: UserProfile,
	): Promise<void> {
		const user = await this.prismaService.user.update({
			where: { id: model.id() },
			data: {
				profile: {
					update: {
						data: {
							birth_date: model.birthDate(),
							display_name: model.displayName(),
							theme_color: model.themeColor(),
							profile_picture: model.profilePicture(),
							banner_picture: model.bannerPicture(),
							biograph: model.biograph(),
							visibility: model.visibility(),
						},
					},	
				}
			}
		})
	}

	public async updateVisibilitySettings(
		model: UserVisibilitySettings,
	): Promise<void> {
		const user = await this.prismaService.user.update({
			where: { id: model.id() },
			data: {
				visibility_settings: {
					update: {
						data: {
							profile: model.profile(),
							addresses: model.addresses(),
							spot_folders: model.spotFolders(),
							visited_spots: model.visitedSpots(),
							posts: model.posts(),
							favorite_spots: model.favoriteSpots(),
							favorite_spot_folders: model.favoriteSpotFolders(),
							favorite_spot_events: model.favoriteSpotEvents(),
						},
					},
				},
			},
		});
	}

	public async delete(id: string): Promise<void> {
		await this.prismaService.user.delete({
			where: { id: id },
		});
	}
}
