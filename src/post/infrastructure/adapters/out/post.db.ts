import { Inject } from '@nestjs/common';
import { PaginateParameters, Pagination } from 'src/common/common.repository';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { GroupVisibilityConfig } from 'src/group/domain/group-visibility-config.model';
import { Group } from 'src/group/domain/group.model';
import { PostRepository } from 'src/post/application/ports/out/post.repository';
import { PostAttachment } from 'src/post/domain/post-attachment.model';
import { PostThread } from 'src/post/domain/post-thread.model';
import { Post } from 'src/post/domain/post.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserCredentials } from 'src/user/domain/user-credentials.model';
import { UserVisibilityConfig } from 'src/user/domain/user-visibility-config.model';
import { User } from 'src/user/domain/user.model';

export class PostRepositoryImpl implements PostRepository {
	public constructor(
		@Inject(PrismaService)
		protected prismaService: PrismaService,
	) {}

	private mapPostAttachmentToDomain(prisma_model: any): PostAttachment {
		if (prisma_model === undefined || prisma_model === null) return null;

		return PostAttachment.create(
			prisma_model.id,
			prisma_model.file_path,
			prisma_model.file_type,
		);
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
				prisma_model.creator.first_name,
				prisma_model.creator.last_name,
				prisma_model.creator.profile_theme_color,
				prisma_model.creator.profile_picture,
				prisma_model.creator.banner_picture,
				prisma_model.creator.biograph,
				prisma_model.creator.birth_date,
				UserCredentials.create(
					prisma_model.creator.id,
					prisma_model.creator.credentials.name,
					prisma_model.creator.credentials.email,
					prisma_model.creator.credentials.password,
					prisma_model.creator.credentials.phone_number,
					prisma_model.creator.credentials.last_login,
					prisma_model.creator.credentials.last_logout,
				),
				UserVisibilityConfig.create(
					prisma_model.creator.id,
					prisma_model.creator.visibility_configuration
						.profile_visibility,
					prisma_model.creator.visibility_configuration
						.address_visibility,
					prisma_model.creator.visibility_configuration
						.poi_folder_visibility,
					prisma_model.creator.visibility_configuration
						.visited_poi_visibility,
					prisma_model.creator.visibility_configuration
						.post_visibility,
				),
				prisma_model.creator.created_at,
				prisma_model.creator.updated_at,
				prisma_model.creator.is_deleted,
			),
			prisma_model.attachments.map((a) =>
				this.mapPostAttachmentToDomain(a),
			),
			prisma_model.parent
				? this.mapPostToDomain(prisma_model.parent)
				: null,
			prisma_model.children_posts.map((children_post) =>
				this.mapPostToDomain(children_post),
			),
			prisma_model.group
				? Group.create(
						prisma_model.group.id,
						prisma_model.group.name,
						prisma_model.group.about,
						prisma_model.group_picture,
						prisma_model.banner_picture,
						GroupVisibilityConfig.create(
							prisma_model.group.id,
							prisma_model.group.visibility_configuration
								.post_visibility,
							prisma_model.group.visibility_configuration
								.event_visibility,
							prisma_model.group.visibility_configuration
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

	public async paginate(
		params: PaginateParameters,
	): Promise<Pagination<Post>> {
		let query = `SELECT p.id FROM posts p LEFT JOIN groups ON groups.id = p.group_id LEFT JOIN users ON users.id = p.user_id LEFT JOIN posts ON posts.id = p.parent_id`;

		if (params.filters) {
			if (typeof params.filters['groupId'] === 'string') {
				const groupId = params.filters['groupId'];
				if (query.includes('WHERE')) {
					query = `${query} AND p.group_id = '${groupId}'`;
				} else {
					query = `${query} WHERE p.group_id = '${groupId}'`;
				}
			}

			if (typeof params.filters['userId'] === 'string') {
				const userId = params.filters['userId'];
				if (query.includes('WHERE')) {
					query = `${query} AND p.user_id = '${userId}`;
				} else {
					query = `${query} WHERE p.user_id = '${userId}'`;
				}
			}

			if (typeof params.filters['parentId'] === 'string') {
				const parentId = params.filters['parentId'];
				if (query.includes('WHERE')) {
					query = `${query} AND p.parent_id = '${parentId}'`;
				} else {
					query = `${query} WHERE p.parent_id = '${parentId}'`;
				}
			}

			if (typeof params.filters['threadId'] === 'string') {
				const threadId = params.filters['threadId'];
				if (query.includes('WHERE')) {
					query = `${query} AND p.thread_id = '${threadId}'`;
				} else {
					query = `${query} WHERE p.thread_id = '${threadId}'`;
				}
			}

			if (typeof params.filters['title'] === 'string') {
				const title = params.filters['title'];
				if (query.includes('WHERE')) {
					query = `${query} AND LOWER(p.title) LIKE '%${title.toLowerCase()}%'`;
				} else {
					query = `${query} WHERE LOWER(p.title) LIKE '%${title.toLowerCase()}%'`;
				}
			}
		}

		const ids =
			await this.prismaService.$queryRawUnsafe<{ id: string }[]>(query);

		const sort = params.sort ?? 'created_at';
		const sortDirection = params.sortDirection ?? SortDirection.DESC;

		let orderBy = {};

		switch (sort) {
			case 'title':
				orderBy = { title: sortDirection };
				break;
			case 'updatedAt':
			case 'updated_at':
				orderBy = { updated_at: sortDirection };
				break;
			case 'createdAt':
			case 'created_at':
			default:
				orderBy = { created_at: sortDirection };
				break;
		}

		let items = [];

		const paginate = params.paginate ?? false;
		const page = params.page ?? 0;
		const limit = params.limit ?? 12;
		const total = ids.length;

		if (paginate) {
			items = await this.prismaService.post.findMany({
				where: { id: { in: ids.map((row) => row.id) } },
				orderBy: orderBy,
				include: {
					creator: {
						include: {
							credentials: true,
							visibility_configuration: true,
						},
					},
					group: {
						include: {
							visibility_configuration: true,
						},
					},
					parent_post: true,
					children_posts: true,
				},
				skip: limit * page,
				take: limit,
			});
		} else {
			items = await this.prismaService.post.findMany({
				where: { id: { in: ids.map((row) => row.id) } },
				orderBy: orderBy,
				include: {
					creator: {
						include: {
							credentials: true,
							visibility_configuration: true,
						},
					},
					group: {
						include: {
							visibility_configuration: true,
						},
					},
					parent_post: true,
					children_posts: true,
					attachments: true,
				},
			});
		}

		items = items.map((i) => this.mapPostToDomain(i));

		return new Pagination(items, total, page);
	}

	public async findBy(values: Object): Promise<Array<Post>> {
		const groupId = values['groupId'] ?? null;
		const userId = values['userId'] ?? null;
		const parentId = values['parentId'] ?? null;
		const threadId = values['threadId'] ?? null;

		let query = {};

		if (groupId !== null) {
			query['group_id'] = groupId;
		}

		if (userId !== null) {
			query['user_id'] = userId;
		}

		if (parentId !== null) {
			query['parent_id'] = parentId;
		}

		if (threadId !== null) {
			query['thread_id'] = threadId;
		}

		const posts = await this.prismaService.post.findMany({
			where: query,
			include: {
				creator: {
					include: {
						credentials: true,
						visibility_configuration: true,
					},
				},
				group: {
					include: {
						visibility_configuration: true,
					},
				},
				parent_post: true,
				children_posts: true,
				attachments: true,
			},
		});

		return posts.map((p) => this.mapPostToDomain(p));
	}

	public async findAttachmentById(id: string): Promise<PostAttachment> {
		const postAttachment =
			await this.prismaService.postAttachment.findFirst({
				where: {
					id: id,
				},
			});

		return this.mapPostAttachmentToDomain(postAttachment);
	}

	public async findAll(): Promise<Array<Post>> {
		const posts = await this.prismaService.post.findMany({});

		return posts.map((p) => this.mapPostToDomain(p));
	}

	public async findById(id: string): Promise<Post> {
		const post = await this.prismaService.post.findFirst({
			where: {
				id: id,
			},
			include: {
				creator: {
					include: {
						credentials: true,
						visibility_configuration: true,
					},
				},
				group: {
					include: {
						visibility_configuration: true,
					},
				},
				parent_post: true,
				children_posts: true,
				attachments: true,
			},
		});

		return this.mapPostToDomain(post);
	}

	public async store(model: Post): Promise<Post> {
		const post = await this.prismaService.post.create({
			data: {
				id: model.id(),
				title: model.title(),
				content: model.content(),
				visibility: model.visibility(),
				group_id: model.group() ? model.group().id() : null,
				user_id: model.creator().id(),
				created_at: model.createdAt(),
				updated_at: model.updatedAt(),
				thread_id: model.thread().id(),
				depth_level: model.depthLevel(),
				parent_id: model.parent() ? model.parent().id() : null,
			},
			include: {
				creator: {
					include: {
						credentials: true,
						visibility_configuration: true,
					},
				},
				group: {
					include: {
						visibility_configuration: true,
					},
				},
				parent_post: true,
				children_posts: true,
				attachments: true,
				thread: true
			},
		});

		model.attachments().forEach(async (a) => {
			await this.prismaService.postAttachment.create({
				data: {
					id: a.id(),
					file_path: a.filePath(),
					file_type: a.fileType(),
					post_id: model.id(),
				},
			});
		});

		return this.mapPostToDomain(post);
	}

	public async update(model: Post): Promise<Post> {
		const post = await this.prismaService.post.update({
			where: { id: model.id() },
			data: {
				title: model.title(),
				content: model.content(),
				depth_level: model.depthLevel(),
				updated_at: model.updatedAt(),
			},
			include: {
				creator: {
					include: {
						credentials: true,
						visibility_configuration: true,
					},
				},
				group: {
					include: {
						visibility_configuration: true,
					},
				},
				parent_post: true,
				children_posts: true,
				attachments: true,
			},
		});

		await this.prismaService.$queryRawUnsafe(
			`DELETE FROM post_attachments WHERE post_id = '${model.id()}'`,
		);

		model.attachments().forEach(async (a) => {
			await this.prismaService.postAttachment.create({
				data: {
					id: a.id(),
					file_path: a.filePath(),
					file_type: a.fileType(),
					post_id: model.id(),
				},
			});
		});

		return this.mapPostToDomain(post);
	}

	public async delete(id: string): Promise<void> {
		await this.prismaService.post.delete({
			where: {
				id: id,
			},
		});
	}
}
