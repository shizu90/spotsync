import { Inject } from '@nestjs/common';
import {
	PaginateParameters,
	Pagination,
} from 'src/common/core/common.repository';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { LikeRepository } from 'src/like/application/ports/out/like.repository';
import { Like } from 'src/like/domain/like.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserCredentials } from 'src/user/domain/user-credentials.model';
import { UserProfile } from 'src/user/domain/user-profile.model';
import { UserVisibilitySettings } from 'src/user/domain/user-visibility-settings.model';
import { User } from 'src/user/domain/user.model';

export class LikeRepositoryImpl implements LikeRepository {
	constructor(
		@Inject(PrismaService)
		protected prismaService: PrismaService,
	) {}

	private mapLikeToDomain(prisma_model: any): Like {
		if (prisma_model === null || prisma_model === undefined) return null;

		return Like.create(
			prisma_model.id,
			prisma_model.likable_subject,
			prisma_model.likable_id,
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
		);
	}

	public async paginate(
		params: PaginateParameters,
	): Promise<Pagination<Like>> {
		let query = `SELECT id FROM likes`;

		if (params.filters) {
			if (typeof params.filters['subject'] === 'string') {
				if (query.includes('WHERE')) {
					query = `${query} AND likable_subject = '${params.filters['subject']}'`;
				} else {
					query = `${query} WHERE likable_subject = '${params.filters['subject']}'`;
				}
			}

			if (typeof params.filters['subjectId'] === 'string') {
				if (query.includes('WHERE')) {
					query = `${query} AND likable_id = '${params.filters['subjectId']}'`;
				} else {
					query = `${query} WHERE likable_id = '${params.filters['subjectId']}'`;
				}
			}

			if (typeof params.filters['userId'] === 'string') {
				if (query.includes('WHERE')) {
					query = `${query} AND user_id = '${params.filters['userId']}'`;
				} else {
					query = `${query} WHERE user_id = '${params.filters['userId']}'`;
				}
			}
		}

		const ids =
			await this.prismaService.$queryRawUnsafe<{ id: string }[]>(query);

		const sort = params.sort ?? 'created_at';
		const sortDirection = params.sortDirection ?? SortDirection.DESC;

		let orderBy = {};

		switch (sort) {
			case 'created_at':
			case 'createdAt':
			default:
				orderBy = { created_at: sortDirection };
				break;
		}

		const paginate = params.paginate ?? false;
		const limit = params.limit ?? 12;
		const page = (params.page ?? 1)-1;
		const total = ids.length;

		let items = [];

		if (paginate) {
			items = await this.prismaService.like.findMany({
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
			items = await this.prismaService.like.findMany({
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

		return new Pagination(
			items.map((i) => this.mapLikeToDomain(i)),
			total,
			page+1,
			limit,
		);
	}

	public async findBy(values: Object): Promise<Like[]> {
		const subjectId = values['subjectId'] ?? null;
		const subject = values['subject'] ?? null;
		const userId = values['userId'] ?? null;

		let query = {};

		if (subjectId !== null) {
			query['likable_id'] = subjectId;
		}

		if (subject !== null) {
			query['likable_subject'] = subject;
		}

		if (userId !== null) {
			query['user_id'] = userId;
		}

		const likes = await this.prismaService.like.findMany({
			where: query,
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

		return likes.map((like) => this.mapLikeToDomain(like));
	}

	public async countBy(values: Object): Promise<number> {
		const subjectId = values['subjectId'] ?? null;
		const subject = values['subject'] ?? null;
		const userId = values['userId'] ?? null;

		let query = {};

		if (subjectId !== null) {
			query['likable_id'] = subjectId;
		}

		if (subject !== null) {
			query['likable_subject'] = subject;
		}

		if (userId !== null) {
			query['user_id'] = userId;
		}

		const count = await this.prismaService.like.count({
			where: query,
		});

		return count;
	}

	public async findAll(): Promise<Like[]> {
		const likes = await this.prismaService.like.findMany({});

		return likes.map((like) => this.mapLikeToDomain(like));
	}

	public async findById(id: string): Promise<Like> {
		const like = await this.prismaService.like.findFirst({
			where: { id: id },
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

		return this.mapLikeToDomain(like);
	}

	public async store(model: Like): Promise<Like> {
		const like = await this.prismaService.like.create({
			data: {
				id: model.id(),
				likable_id: model.likableSubjectId(),
				likable_subject: model.likableSubject(),
				created_at: model.createdAt(),
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

		return this.mapLikeToDomain(like);
	}

	public async update(model: Like): Promise<void> {
		await this.prismaService.like.update({
			where: { id: model.id() },
			data: {
				likable_id: model.likableSubjectId(),
				likable_subject: model.likableSubject(),
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
		await this.prismaService.like.delete({
			where: { id: id },
		});
	}
}
