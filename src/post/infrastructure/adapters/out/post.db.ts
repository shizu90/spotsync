import { Inject } from '@nestjs/common';
import * as moment from 'moment';
import { env } from 'process';
import { RedisService } from 'src/cache/redis.service';
import {
	PaginateParameters,
	Pagination,
} from 'src/common/core/common.repository';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { FollowStatus } from 'src/follower/domain/follow-status.enum';
import { PostRepository } from 'src/post/application/ports/out/post.repository';
import { PostVisibility } from 'src/post/domain/post-visibility.enum';
import { Post } from 'src/post/domain/post.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostEntityMapper } from './mappers/post-entity.mapper';

const REDIS_DB_TTL = env.REDIS_DB_TTL;

export class PostRepositoryImpl implements PostRepository {
	private _postEntityMapper: PostEntityMapper = new PostEntityMapper();

	public constructor(
		@Inject(PrismaService)
		protected prismaService: PrismaService,
		@Inject(RedisService)
		protected redisService: RedisService,
	) {}

	private async _getCachedData(key: string): Promise<any> {
		const data = await this.redisService.get(key);
		
		if (data) return JSON.parse(data, (key, value) => {
			const valid = moment(value, moment.ISO_8601, true).isValid();

			if (valid) return moment(value);
		});

		return null;
	}

	private async _setCachedData(key: string, data: any): Promise<void> {
		await this.redisService.set(key, JSON.stringify(data), "EX", REDIS_DB_TTL);
	}

	private _mountQuery(values: Object): Object {
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

		return query;
	}

	private _mountAuthorizedQuery(authenticatedUserId: string, values: Object): Object {
		const groupId = values['groupId'] ?? null;
		const parentId = values['parentId'] ?? null;
		const threadId = values['threadId'] ?? null;
		const depthLevel = values['depthLevel'] ?? null;
		const creatorId = values['creatorId'] ?? null;

		let query = {
			OR: [
				{
					visibility: PostVisibility.PUBLIC.toString(),
				},
				{
					user_id: authenticatedUserId,
				},
				{
					group: {
						OR: [
							{
								visibility_settings: {
									posts: PostVisibility.PUBLIC.toString(),
								}
							},
							{
								members: {
									some: {
										user_id: authenticatedUserId,
									}
								}
							}
						]
					}
				},
				{
					creator: {
						followers: {
							some: {
								from_user_id: authenticatedUserId,
								status: FollowStatus.ACTIVE.toString(),
							}
						}
					}
				}
			]
		};

		if (groupId !== null) {
			query['group_id'] = groupId;
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

		if (creatorId !== null) {
			query['user_id'] = creatorId;
		}

		return query;
	}

	private async _getThreadMaxDepthLevel(post_id: string): Promise<number> {
		const threadMaxDepthLevel = await this.prismaService.$queryRawUnsafe<{
			max_depth_level: number;
		}>(`
			SELECT max_depth_level FROM post_threads WHERE id = (SELECT thread_id FROM posts WHERE id = '${post_id}')
		`);

		return threadMaxDepthLevel[0]?.max_depth_level;
	}

	private _mountIncludeTree(maxDepthLevel: number): Object {
		return {
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
			parent_post: true,
			children_posts:
				maxDepthLevel > 0
					? { include: this._mountIncludeTree(maxDepthLevel - 1) }
					: true,
			attachments: true,
			thread: true,
		};
	}

	private _mountInclude(): Object {
		return {
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
		};
	}

	public async paginate(
		params: PaginateParameters,
	): Promise<Pagination<Post>> {
		const key = `post:paginate:${JSON.stringify(params)}`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return new Pagination(
				cachedData.items.map((i) => this._postEntityMapper.toModel(i)),
				cachedData.total,
				cachedData.current_page,
				cachedData.limit,
			);
		}

		const query = this._mountQuery(params.filters);
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
		const page = (params.page ?? 1) - 1;
		const limit = params.limit ?? 12;
		const total = await this.countBy(params.filters);

		if (paginate) {
			items = await this.prismaService.post.findMany({
				where: query,
				orderBy: orderBy,
				include: this._mountInclude(),
				skip: limit * page,
				take: limit,
			});
		} else {
			items = await this.prismaService.post.findMany({
				where: query,
				orderBy: orderBy,
				include: this._mountInclude(),
			});
		}

		await this._setCachedData(key, new Pagination(items, total, page + 1, limit));

		items = items.map((i) => this._postEntityMapper.toModel(i));

		return new Pagination(items, total, page + 1, limit);
	}

	public async paginateAuthorizedPosts(userId: string, params: PaginateParameters): Promise<Pagination<Post>> {
		const key = `post:paginateAuthorizedPosts:${userId}:${JSON.stringify(params)}`;

		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return new Pagination(
				cachedData.items.map((i) => this._postEntityMapper.toModel(i)),
				cachedData.total,
				cachedData.current_page,
				cachedData.limit,
			);
		}

		
		const query = this._mountAuthorizedQuery(userId, params.filters);
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
		const page = (params.page ?? 1) - 1;
		const limit = params.limit ?? 12;
		const total = await this.countBy(params.filters);

		if (paginate) {
			items = await this.prismaService.post.findMany({
				where: query,
				orderBy: orderBy,
				include: this._mountInclude(),
				skip: limit * page,
				take: limit,
			});
		} else {
			items = await this.prismaService.post.findMany({
				where: query,
				orderBy: orderBy,
				include: this._mountInclude(),
			});
		}

		await this._setCachedData(key, new Pagination(items, total, page + 1, limit));

		items = items.map((i) => this._postEntityMapper.toModel(i));

		return new Pagination(items, total, page + 1, limit);
	}

	public async findBy(values: Object): Promise<Array<Post>> {
		const key = `post:findBy:${JSON.stringify(values)}`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return cachedData.map((p) => this._postEntityMapper.toModel(p));
		}

		const query = this._mountQuery(values);
		const posts = await this.prismaService.post.findMany({
			where: query,
			include: this._mountInclude(),
		});

		await this._setCachedData(key, posts);

		return posts.map((p) => this._postEntityMapper.toModel(p));
	}

	public async countBy(values: Object): Promise<number> {
		const key = `post:countBy:${JSON.stringify(values)}`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return cachedData;
		}

		const query = this._mountQuery(values);
		const count = await this.prismaService.post.count({
			where: query,
		});

		await this._setCachedData(key, count);

		return count;
	}

	public async findAll(): Promise<Array<Post>> {
		const key = 'post:findAll';
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return cachedData.map((p) => this._postEntityMapper.toModel(p));
		}

		const posts = await this.prismaService.post.findMany({
			include: this._mountInclude(),
		});

		await this._setCachedData(key, posts);

		return posts.map((p) => this._postEntityMapper.toModel(p));
	}

	public async findById(id: string): Promise<Post> {
		const key = `post:findById:${id}`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return this._postEntityMapper.toModel(cachedData);
		}

		const maxDepthLevel = await this._getThreadMaxDepthLevel(id);

		const include = this._mountIncludeTree(maxDepthLevel);

		const post = await this.prismaService.post.findFirst({
			where: {
				id: id,
			},
			include: include,
		});

		await this._setCachedData(key, post);

		return this._postEntityMapper.toModel(post);
	}

	public async findAuthorizedPostById(userId: string, postId: string): Promise<Post> {
		const key = `post:findAuthorizedPostById:${userId}:${postId}`;

		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return this._postEntityMapper.toModel(cachedData);
		}

		const maxDepthLevel = await this._getThreadMaxDepthLevel(postId);

		const include = this._mountIncludeTree(maxDepthLevel);

		const post = await this.prismaService.post.findFirst({
			where: {
				id: postId,
				AND: this._mountAuthorizedQuery(userId, {}),
			},
			include: include,
		});

		await this._setCachedData(key, post);

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
				total_likes: model.totalLikes(),
			},
			include: this._mountInclude(),
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
				total_likes: model.totalLikes(),
			},
		});

		await this.prismaService.postAttachment.deleteMany({
			where: {
				post_id: model.id(),
			}
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
	}

	public async delete(id: string): Promise<void> {
		await this.prismaService.post.delete({
			where: {
				id: id,
			},
		});
	}
}
