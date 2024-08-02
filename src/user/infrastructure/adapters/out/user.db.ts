import { Inject } from '@nestjs/common';
import { PaginateParameters, Pagination } from 'src/common/common.repository';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRepository } from 'src/user/application/ports/out/user.repository';
import { UserCredentials } from 'src/user/domain/user-credentials.model';
import { UserVisibilityConfig } from 'src/user/domain/user-visibility-config.model';
import { User } from 'src/user/domain/user.model';

export class UserRepositoryImpl implements UserRepository {
	public constructor(
		@Inject(PrismaService) protected prismaService: PrismaService,
	) {}

	private mapUserToDomain(prisma_model: any): User | null {
		if (prisma_model === null || prisma_model === undefined) return null;

		return User.create(
			prisma_model.id,
			prisma_model.first_name,
			prisma_model.last_name,
			prisma_model.profile_theme_color,
			prisma_model.profile_picture,
			prisma_model.banner_picture,
			prisma_model.biograph,
			prisma_model.birth_date,
			prisma_model.credentials
				? UserCredentials.create(
						prisma_model.id,
						prisma_model.credentials.name,
						prisma_model.credentials.email,
						prisma_model.credentials.password,
						prisma_model.credentials.phone_number,
						prisma_model.credentials.last_login,
						prisma_model.credentials.last_logout,
					)
				: null,
			prisma_model.visibility_configuration
				? UserVisibilityConfig.create(
						prisma_model.id,
						prisma_model.visibility_configuration.profile,
						prisma_model.visibility_configuration.addresses,
						prisma_model.visibility_configuration.spot_folders,
						prisma_model.visibility_configuration.visited_spots,
						prisma_model.visibility_configuration.posts,
						prisma_model.visibility_configuration.favorite_spots,
						prisma_model.visibility_configuration
							.favorite_spot_folders,
						prisma_model.visibility_configuration
							.favorite_spot_events,
					)
				: null,
			prisma_model.created_at,
			prisma_model.updated_at,
			prisma_model.is_deleted,
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
		const page = params.page ?? 0;
		const limit = params.limit ?? 12;
		const total = ids.length;

		if (paginate) {
			items = await this.prismaService.user.findMany({
				where: { id: { in: ids.map((row) => row.id) } },
				orderBy: orderBy,
				include: { credentials: true, visibility_configuration: true },
				skip: limit * page,
				take: limit,
			});
		} else {
			items = await this.prismaService.user.findMany({
				where: { id: { in: ids.map((row) => row.id) } },
				orderBy: orderBy,
				include: { credentials: true, visibility_configuration: true },
			});
		}

		items = items.map((i) => {
			return this.mapUserToDomain(i);
		});

		return new Pagination(items, total, page);
	}

	public async findBy(values: Object): Promise<Array<User>> {
		const name = values['name'];
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
			include: { credentials: true, visibility_configuration: true },
		});

		return users.map((user) => {
			return this.mapUserToDomain(user);
		});
	}

	public async countBy(values: Object): Promise<number> {
		const name = values['name'];
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
				visibility_configuration: true,
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
				visibility_configuration: true,
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
				visibility_configuration: true,
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
				visibility_configuration: true,
			},
		});

		return this.mapUserToDomain(user);
	}

	public async store(model: User): Promise<User> {
		const user = await this.prismaService.user.create({
			data: {
				id: model.id(),
				first_name: model.firstName(),
				last_name: model.lastName(),
				banner_picture: model.bannerPicture(),
				profile_picture: model.profilePicture(),
				biograph: model.biograph(),
				birth_date: model.birthDate(),
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
				visibility_configuration: {
					create: {
						profile: model.visibilityConfiguration().profile(),
						addresses: model.visibilityConfiguration().addresses(),
						spot_folders: model
							.visibilityConfiguration()
							.spotFolders(),
						visited_spots: model
							.visibilityConfiguration()
							.visitedSpots(),
						posts: model.visibilityConfiguration().posts(),
						favorite_spots: model
							.visibilityConfiguration()
							.favoriteSpots(),
						favorite_spot_folders: model
							.visibilityConfiguration()
							.favoriteSpotFolders(),
						favorite_spot_events: model
							.visibilityConfiguration()
							.favoriteSpotEvents(),
					},
				},
			},
			include: {
				credentials: true,
				visibility_configuration: true,
			},
		});

		return this.mapUserToDomain(user);
	}

	public async update(model: User): Promise<void> {
		await this.prismaService.user.update({
			data: {
				first_name: model.firstName(),
				last_name: model.lastName(),
				biograph: model.biograph(),
				banner_picture: model.bannerPicture(),
				profile_picture: model.profilePicture(),
				birth_date: model.birthDate(),
				is_deleted: model.isDeleted(),
				updated_at: model.updatedAt(),
			},
			where: {
				id: model.id(),
			},
			include: {
				credentials: true,
				visibility_configuration: true,
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

	public async updateVisibilityConfig(
		model: UserVisibilityConfig,
	): Promise<void> {
		const user = await this.prismaService.user.update({
			where: { id: model.id() },
			data: {
				visibility_configuration: {
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
			include: {
				credentials: true,
				addresses: true,
				visibility_configuration: true,
			},
		});
	}
}
