import { Inject } from '@nestjs/common';
import { Comment } from 'src/comment/domain/comment.model';
import {
	PaginateParameters,
	Pagination,
} from 'src/common/core/common.repository';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { GroupVisibilitySettings } from 'src/group/domain/group-visibility-settings.model';
import { Group } from 'src/group/domain/group.model';
import { LikeRepository } from 'src/like/application/ports/out/like.repository';
import { LikableSubject } from 'src/like/domain/likable-subject.enum';
import { Like } from 'src/like/domain/like.model';
import { PostAttachment } from 'src/post/domain/post-attachment.model';
import { PostThread } from 'src/post/domain/post-thread.model';
import { Post } from 'src/post/domain/post.model';
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

	private mapCommentToDomain(prisma_model: any): Comment {
		if (prisma_model === undefined || prisma_model === null) return null;

		return Comment.create(
			prisma_model.id,
			prisma_model.text,
			User.create(
				prisma_model.creator.id,
				UserProfile.create(
					prisma_model.creator.id,
					prisma_model.creator.profile.birth_date,
					prisma_model.creator.profile.display_name,
					prisma_model.creator.profile.theme_color,
					prisma_model.creator.profile.profile_picture,
					prisma_model.creator.profile.banner_picture,
					prisma_model.creator.profile.biograph,
					prisma_model.creator.profile.visibility
				),
				UserCredentials.create(
					prisma_model.creator.id,
					prisma_model.creator.credentials.name,
					prisma_model.creator.credentials.email,
					prisma_model.creator.credentials.password,
					prisma_model.creator.credentials.phone_number,
					prisma_model.creator.credentials.last_login,
					prisma_model.creator.credentials.last_logout,
				),
				UserVisibilitySettings.create(
					prisma_model.creator.id,
					prisma_model.creator.visibility_settings.profile,
					prisma_model.creator.visibility_settings.addresses,
					prisma_model.creator.visibility_settings.spot_folders,
					prisma_model.creator.visibility_settings.visited_spots,
					prisma_model.creator.visibility_settings.posts,
					prisma_model.creator.visibility_settings.favorite_spots,
					prisma_model.creator.visibility_settings.favorite_spot_folders,
					prisma_model.creator.visibility_settings.favorite_spot_events,
				),
				prisma_model.creator.status,
				prisma_model.creator.created_at,
				prisma_model.creator.updated_at,
				prisma_model.creator.is_deleted
			),
			prisma_model.subject,
		)
	}

	private mapPostToDomain(prisma_model: any): Post {
		if (prisma_model === undefined || prisma_model === null) return null;

		return Post.create(
			prisma_model.id,
			prisma_model.title,
			prisma_model.content,
			prisma_model.visibility,
			User.create(
				prisma_model.creator.id,
				UserProfile.create(
					prisma_model.creator.id,
					prisma_model.creator.profile.birth_date,
					prisma_model.creator.profile.display_name,
					prisma_model.creator.profile.theme_color,
					prisma_model.creator.profile.profile_picture,
					prisma_model.creator.profile.banner_picture,
					prisma_model.creator.profile.biograph,
					prisma_model.creator.profile.visibility
				),
				UserCredentials.create(
					prisma_model.creator.id,
					prisma_model.creator.credentials.name,
					prisma_model.creator.credentials.email,
					prisma_model.creator.credentials.password,
					prisma_model.creator.credentials.phone_number,
					prisma_model.creator.credentials.last_login,
					prisma_model.creator.credentials.last_logout,
				),
				UserVisibilitySettings.create(
					prisma_model.creator.id,
					prisma_model.creator.visibility_settings.profile,
					prisma_model.creator.visibility_settings.addresses,
					prisma_model.creator.visibility_settings.spot_folders,
					prisma_model.creator.visibility_settings.visited_spots,
					prisma_model.creator.visibility_settings.posts,
					prisma_model.creator.visibility_settings.favorite_spots,
					prisma_model.creator.visibility_settings.favorite_spot_folders,
					prisma_model.creator.visibility_settings.favorite_spot_events,
				),
				prisma_model.creator.status,
				prisma_model.creator.created_at,
				prisma_model.creator.updated_at,
				prisma_model.creator.is_deleted
			),
			prisma_model.attachments.map((a) =>
				PostAttachment.create(
					a.id,
					a.file_path,
					a.file_type,
				),
			),
			prisma_model.parent
				? this.mapPostToDomain(prisma_model.parent)
				: null,
			[],
			prisma_model.group
				? Group.create(
						prisma_model.group.id,
						prisma_model.group.name,
						prisma_model.group.about,
						prisma_model.group_picture,
						prisma_model.banner_picture,
						GroupVisibilitySettings.create(
							prisma_model.group.id,
							prisma_model.group.visibility_settings
								.post_visibility,
							prisma_model.group.visibility_settings
								.event_visibility,
							prisma_model.group.visibility_settings
								.group_visibility,
						),
						prisma_model.group.created_at,
						prisma_model.group.updated_at,
						prisma_model.group.is_deleted,
					)
				: null,
			prisma_model.thread
				? PostThread.create(
						prisma_model.thread.id,
						prisma_model.thread.max_depth_level,
						prisma_model.thread.created_at,
					)
				: null,
			prisma_model.depth_level,
			prisma_model.created_at,
			prisma_model.updated_at,
		);
	}

	private mapLikeToDomain(prisma_model: any): Like {
		if (prisma_model === null || prisma_model === undefined) return null;

		return Like.create(
			prisma_model.id,
			prisma_model.likable_subject,
			prisma_model.likable_subject === LikableSubject.POST.toString() ? this.mapPostToDomain(prisma_model.post) : null,
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

	private mapSubjectId(subject: LikableSubject): string {
		switch(subject) {
			case LikableSubject.POST:
				return 'post_id';
			case LikableSubject.COMMENT:
				return 'comment_id';
			default: 
				return 'post_id';
		}
	}

	public async paginate(
		params: PaginateParameters,
	): Promise<Pagination<Like>> {
		let query = `SELECT id FROM likes`;

		if (params.filters) {
			if (typeof params.filters['subject'] === 'string') {
				const subject = params.filters['subject'];

				if (query.includes('WHERE')) {
					query = `${query} AND likable_subject = '${subject}'`;
				} else {
					query = `${query} WHERE likable_subject = '${subject}'`;
				}

				if (typeof params.filters['subjectId'] === 'string') {
					const subjectId = params.filters['subjectId'];

					if (query.includes('WHERE')) {
						query = `${query} AND ${this.mapSubjectId(subject as LikableSubject)} = '${subjectId}'`;
					} else {
						query = `${query} WHERE ${this.mapSubjectId(subject as LikableSubject)} = '${subjectId}'`;
					}
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
					post: {
						include: {
							attachments: true,
							creator: true,
							thread: true,
							group: true,
						}
					},
					comment: {
						include: {
							user: true,
						}
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
					post: {
						include: {
							attachments: true,
							creator: true,
							thread: true,
							group: true,
						}
					},
					comment: {
						include: {
							user: true,
						}
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
				post: {
					include: {
						attachments: true,
						creator: true,
						thread: true,
						group: true,
					}
				},
				comment: {
					include: {
						user: true,
					}
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
		const likes = await this.prismaService.like.findMany({
			include: {
				user: {
					include: {
						credentials: true,
						visibility_settings: true,
						profile: true,
					},
				},
				post: {
					include: {
						attachments: true,
						creator: true,
						thread: true,
						group: true,
					}
				},
				comment: {
					include: {
						user: true,
					}
				},
			}
		});

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
				post: {
					include: {
						attachments: true,
						creator: true,
						thread: true,
						group: true,
					}
				},
				comment: {
					include: {
						user: true,
					}
				},
			},
		});

		return this.mapLikeToDomain(like);
	}

	public async store(model: Like): Promise<Like> {
		const like = await this.prismaService.like.create({
			data: {
				id: model.id(),
				post_id: model.likableSubject() === LikableSubject.POST ? model.likable().id() : null,
				comment_id: model.likableSubject() === LikableSubject.COMMENT ? model.likable().id() : null,
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
				post: {
					include: {
						attachments: true,
						creator: true,
						thread: true,
						group: true,
					}
				},
				comment: {
					include: {
						user: true,
					}
				},
			},
		});

		return this.mapLikeToDomain(like);
	}

	public async update(model: Like): Promise<void> {
		await this.prismaService.like.update({
			where: { id: model.id() },
			data: {
				likable_subject: model.likableSubject(),
				post_id: model.likableSubject() === LikableSubject.POST ? model.likable().id() : null,
				comment_id: model.likableSubject() === LikableSubject.COMMENT ? model.likable().id() : null,
			},
		});
	}

	public async delete(id: string): Promise<void> {
		await this.prismaService.like.delete({
			where: { id: id },
		});
	}
}
