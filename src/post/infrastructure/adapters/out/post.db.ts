import { Inject } from '@nestjs/common';
import {
	PaginateParameters,
	Pagination,
} from 'src/common/core/common.repository';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { PostRepository } from 'src/post/application/ports/out/post.repository';
import { Post } from 'src/post/domain/post.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostEntityMapper } from './mappers/post-entity.mapper';

export class PostRepositoryImpl implements PostRepository {
	private _postEntityMapper: PostEntityMapper = new PostEntityMapper();
	
	public constructor(
		@Inject(PrismaService)
		protected prismaService: PrismaService,
	) {}

	private async getThreadMaxDepthLevel(post_id: string): Promise<number> {
		const threadMaxDepthLevel = await this.prismaService.$queryRawUnsafe<{
			max_depth_level: number;
		}>(`
			SELECT max_depth_level FROM post_threads WHERE id = (SELECT thread_id FROM posts WHERE id = '${post_id}')
		`);

		return threadMaxDepthLevel[0]?.max_depth_level;
	}

	private mountIncludeTree(maxDepthLevel: number): any {
		return {
			creator: {
				include: {
					credentials: true,
					visibility_settings: true,
				},
			},
			group: {
				include: {
					visibility_settings: true,
				},
			},
			parent_post: true,
			children_posts:
				maxDepthLevel > 0
					? { include: this.mountIncludeTree(maxDepthLevel - 1) }
					: true,
			attachments: true,
			thread: true,
		};
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

			if (typeof params.filters['depthLevel'] === 'number') {
				const depthLevel = params.filters['depthLevel'];
				if (query.includes('WHERE')) {
					query = `${query} AND p.depth_level = ${depthLevel}`;
				} else {
					query = `${query} WHERE p.depth_level = ${depthLevel}`;
				}
			}

			if (typeof params.filters['visibility'] === 'string') {
				const visibility = params.filters['visibility'];
				if (query.includes('WHERE')) {
					query = `${query} AND p.visibility = '${visibility}'`;
				} else {
					query = `${query} WHERE p.visibility = '${visibility}'`;
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
		const page = (params.page ?? 1)-1;
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
							visibility_settings: true,
						},
					},
					group: {
						include: {
							visibility_settings: true,
						},
					},
					parent_post: {
						include: {
							creator: {
								include: {
									credentials: true,
									visibility_settings: true,
									profile: true,
								},
							},
							group: {
								include: {
									visibility_settings: true,
								},
							},
							attachments: true,
						},
					},
					children_posts: false,
					attachments: true,
					thread: true,
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
							visibility_settings: true,
						},
					},
					group: {
						include: {
							visibility_settings: true,
						},
					},
					parent_post: {
						include: {
							creator: {
								include: {
									credentials: true,
									visibility_settings: true,
									profile: true,
								},
							},
							group: {
								include: {
									visibility_settings: true,
								},
							},
							attachments: true,
						},
					},
					children_posts: false,
					attachments: true,
					thread: true,
				},
			});
		}

		items = items.map((i) => this._postEntityMapper.toModel(i));

		return new Pagination(items, total, page+1, limit);
	}

	public async findBy(values: Object): Promise<Array<Post>> {
		const groupId = values['groupId'] ?? null;
		const userId = values['userId'] ?? null;
		const parentId = values['parentId'] ?? null;
		const threadId = values['threadId'] ?? null;
		const depthLevel = values['depthLevel'] ?? null;

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

		if (depthLevel !== null) {
			query['depth_level'] = depthLevel;
		}

		const posts = await this.prismaService.post.findMany({
			where: query,
			include: {
				creator: {
					include: {
						credentials: true,
						visibility_settings: true,
					},
				},
				group: {
					include: {
						visibility_settings: true,
					},
				},
				parent_post: {
					include: {
						creator: {
							include: {
								credentials: true,
								visibility_settings: true,
							},
						},
						group: {
							include: {
								visibility_settings: true,
							},
						},
						attachments: true,
					},
				},
				children_posts: false,
				attachments: true,
				thread: true,
			},
		});

		return posts.map((p) => this._postEntityMapper.toModel(p));
	}

	public async countBy(values: Object): Promise<number> {
		const groupId = values['groupId'] ?? null;
		const userId = values['userId'] ?? null;
		const parentId = values['parentId'] ?? null;
		const threadId = values['threadId'] ?? null;
		const depthLevel = values['depthLevel'] ?? null;

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

		if (depthLevel !== null) {
			query['depth_level'] = depthLevel;
		}

		const count = await this.prismaService.post.count({
			where: query,
		});

		return count;
	}

	public async findAll(): Promise<Array<Post>> {
		const posts = await this.prismaService.post.findMany({
			include: {
				creator: {
					include: {
						credentials: true,
						visibility_settings: true,
					},
				},
				group: {
					include: {
						visibility_settings: true,
					},
				},
				parent_post: {
					include: {
						creator: {
							include: {
								credentials: true,
								visibility_settings: true,
							},
						},
						group: {
							include: {
								visibility_settings: true,
							},
						},
						attachments: true,
					},
				},
				children_posts: false,
				attachments: true,
				thread: true,
			},
		});

		return posts.map((p) => this._postEntityMapper.toModel(p));
	}

	public async findById(id: string): Promise<Post> {
		const maxDepthLevel = await this.getThreadMaxDepthLevel(id);

		const include = this.mountIncludeTree(maxDepthLevel);

		const post = await this.prismaService.post.findFirst({
			where: {
				id: id,
			},
			include: include,
		});

		return this._postEntityMapper.toModel(post);
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
						visibility_settings: true,
					},
				},
				group: {
					include: {
						visibility_settings: true,
					},
				},
				parent_post: true,
				children_posts: true,
				attachments: true,
				thread: true,
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

		return this._postEntityMapper.toModel(post);
	}

	public async update(model: Post): Promise<void> {
		await this.prismaService.post.update({
			where: { id: model.id() },
			data: {
				title: model.title(),
				content: model.content(),
				depth_level: model.depthLevel(),
				updated_at: model.updatedAt(),
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
	}

	public async delete(id: string): Promise<void> {
		await this.prismaService.post.delete({
			where: {
				id: id,
			},
		});
	}
}
