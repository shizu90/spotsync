import { Inject } from "@nestjs/common";
import { PaginateParameters, Pagination } from "src/common/core/common.repository";
import { SortDirection } from "src/common/enums/sort-direction.enum";
import { PrismaService } from "src/prisma/prisma.service";
import { PasswordRecoveryRepository } from "src/user/application/ports/out/password-recovery.repository";
import { PasswordRecovery } from "src/user/domain/password-recovery.model";
import { UserCredentials } from "src/user/domain/user-credentials.model";
import { UserProfile } from "src/user/domain/user-profile.model";
import { UserVisibilitySettings } from "src/user/domain/user-visibility-settings.model";
import { User } from "src/user/domain/user.model";

export class PasswordRecoveryRepositoryImpl implements PasswordRecoveryRepository {
    public constructor(
		@Inject(PrismaService) protected prismaService: PrismaService,
	) {}

	private mapPasswordRecoveryToDomain(prisma_model: any): PasswordRecovery | null {
		if (prisma_model === null || prisma_model === undefined) return null;

		return PasswordRecovery.create(
			prisma_model.id,
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
			prisma_model.status,
			prisma_model.token,
			prisma_model.created_at,
			prisma_model.expires_at
		);
	}

	public async paginate(params: PaginateParameters): Promise<Pagination<PasswordRecovery>> {
		let query = 'SELECT password_recoveries.id FROM password_recoveries';
		
		if (params.filters) {
			if (typeof params.filters['status'] === 'string') {
				const status = params.filters['status'];
				if (query.includes('WHERE')) {
					query = `${query} AND status = '${status}'`;
				} else {
					query = `${query} WHERE status = '${status}'`;
				}
			}

			if (typeof params.filters['token'] === 'string') {
				const token = params.filters['token'];
				if (query.includes('WHERE')) {
					query = `${query} AND token = '${token}'`;
				} else {
					query = `${query} WHERE token = '${token}'`;
				}
			}

			if (typeof params.filters['userId'] === 'string') {
				const userId = params.filters['userId'];
				if (query.includes('WHERE')) {
					query = `${query} AND user_id = '${userId}'`;
				} else {
					query = `${query} WHERE user_id = '${userId}'`;
				}
			}
		}

		const ids = 
			await this.prismaService.$queryRawUnsafe<{ id: string }[]>(query);
		
		const sort = params.sort ?? 'created_at';
		const sortDirection = params.sortDirection ?? SortDirection.DESC;

		let orderBy = {};

		switch (sort) {
			case 'expiredAt':
			case 'expired_at':
				orderBy = { expired_at: sortDirection };
				break;
			case 'createdAt':
			case 'created_at':
			default:
				orderBy = { created_at: sortDirection };
				break;
		}

		let items = [];

		const paginate = params.paginate ?? false;
		const page = (params.page ?? 1)-1;
		const limit = params.limit ?? 12;
		const total = ids.length;

		if (paginate) {
			items = await this.prismaService.passwordRecovery.findMany({
				where: { id: { in: ids.map(row => row.id) } },
				include: {
					user: {
						include: {
							credentials: true,
							visibility_settings: true,
							profile: true,
						}
					}
				},
				orderBy: orderBy,
				skip: page * limit,
				take: limit,
			})
		} else {
			items = await this.prismaService.passwordRecovery.findMany({
				where: { id: { in: ids.map(row => row.id) } },
				include: {
					user: {
						include: {
							credentials: true,
							visibility_settings: true,
							profile: true,
						}
					}
				},
				orderBy: orderBy,
			})
		}

		items = items.map((i) => {
			return this.mapPasswordRecoveryToDomain(i);
		});

		return new Pagination(items, total, page+1, limit);
	}

	public async findBy(values: Object): Promise<PasswordRecovery[]> {
		const token = values['token'];
		const userId = values['userId'];
		const status = values['status'];

		let query = 
			'SELECT password_recoveries.id FROM password_recoveries';
		
		if (token) {
			if (query.includes('WHERE')) {
				query = `${query} AND token = '${token}'`;
			} else {
				query = `${query} WHERE token = '${token}'`;
			}
		}

		if (userId) {
			if (query.includes('WHERE')) {
				query = `${query} AND user_id = '${userId}'`;
			} else {
				query = `${query} WHERE user_id = '${userId}'`;
			}
		}

		if (status) {
			if (query.includes('WHERE')) {
				query = `${query} AND status = '${status}'`;
			} else {
				query = `${query} WHERE status = '${status}'`;
			}
		}

		const ids = 
			await this.prismaService.$queryRawUnsafe<{ id: string }[]>(query);

		const items = await this.prismaService.passwordRecovery.findMany({
			where: { id: { in: ids.map(row => row.id) } },
			include: {
				user: {
					include: {
						credentials: true,
						visibility_settings: true,
						profile: true,
					}
				}
			}
		});

		return items.map((i) => {
			return this.mapPasswordRecoveryToDomain(i);
		});
	}
	public async countBy(values: Object): Promise<number> {
		const token = values['token'];
		const userId = values['userId'];
		const status = values['status'];

		let query = 
			'SELECT password_recovery.id FROM password_recovery';
		
		if (token) {
			if (query.includes('WHERE')) {
				query = `${query} AND token = '${token}'`;
			} else {
				query = `${query} WHERE token = '${token}'`;
			}
		}

		if (userId) {
			if (query.includes('WHERE')) {
				query = `${query} AND user_id = '${userId}'`;
			} else {
				query = `${query} WHERE user_id = '${userId}'`;
			}
		}

		if (status) {
			if (query.includes('WHERE')) {
				query = `${query} AND status = '${status}'`;
			} else {
				query = `${query} WHERE status = '${status}'`;
			}
		}

		const ids = 
			await this.prismaService.$queryRawUnsafe<{ id: string }[]>(query);

		const count = await this.prismaService.user.count({
			where: { id: { in: ids.map(row => row.id) } }
		});

		return count;
	}
	
	public async findById(id: string): Promise<PasswordRecovery> {
		const passwordRecovery = await this.prismaService.passwordRecovery.findUnique({
			where: { id: id },
			include: {
				user: {
					include: {
						credentials: true,
						visibility_settings: true,
						profile: true,
					}
				}
			}
		});

		return this.mapPasswordRecoveryToDomain(passwordRecovery);
	}
	public async findAll(): Promise<PasswordRecovery[]> {
		const passwordRecoveries = await this.prismaService.passwordRecovery.findMany({
			include: {
				user: {
					include: {
						credentials: true,
						visibility_settings: true,
						profile: true,
					}
				}
			}
		});

		return passwordRecoveries.map((i) => {
			return this.mapPasswordRecoveryToDomain(i);
		});
	}
	public async store(model: PasswordRecovery): Promise<PasswordRecovery> {
		const passwordRecovery = await this.prismaService.passwordRecovery.create({
			data: {
				user_id: model.user().id(),
				status: model.status(),
				token: model.token(),
				created_at: model.createdAt(),
				expires_at: model.expiresAt()
			},
			include: {
				user: {
					include: {
						credentials: true,
						visibility_settings: true,
						profile: true,
					}
				}
			}
		});

		return this.mapPasswordRecoveryToDomain(passwordRecovery);
	}
	public async update(model: PasswordRecovery): Promise<void> {
		await this.prismaService.passwordRecovery.update({
			where: { id: model.id() },
			data: {
				status: model.status(),
				token: model.token(),
				created_at: model.createdAt(),
				expires_at: model.expiresAt()
			}
		});
	}
	public async delete(id: string): Promise<void> {
		await this.prismaService.passwordRecovery.delete({
			where: { id: id }
		});
	}
}