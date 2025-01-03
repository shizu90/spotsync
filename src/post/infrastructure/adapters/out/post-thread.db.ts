import { Inject } from '@nestjs/common';
import { CacheableRepository } from 'src/cache/cacheable.repository';
import { RedisService } from 'src/cache/redis.service';
import {
	PaginateParameters,
	Pagination,
} from 'src/common/core/common.repository';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { PostThreadRepository } from 'src/post/application/ports/out/post-thread.repository';
import { PostThread } from 'src/post/domain/post-thread.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostThreadEntityMapper } from './mappers/post-thread-entity.mapper';

export class PostThreadRepositoryImpl extends CacheableRepository implements PostThreadRepository {
	private _postThreadEntityMapper: PostThreadEntityMapper =
		new PostThreadEntityMapper();

	constructor(
		@Inject(PrismaService)
		protected prismaService: PrismaService,
		@Inject(RedisService)
		protected redisService: RedisService,
	) {super(redisService)}

	private _mountQuery(values: Object): Object {
		const maxDepthLevel = values['maxDepthLevel'] ?? null;

		let query = {};

		if (maxDepthLevel !== null) {
			query['max_depth_level'] = maxDepthLevel;
		}

		return query;
	}

	public async paginate(
		params: PaginateParameters,
	): Promise<Pagination<PostThread>> {
		const key = `post-thread:paginate:${JSON.stringify(params)}`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return new Pagination(
				cachedData.items.map((i) => this._postThreadEntityMapper.toModel(i)),
				cachedData.total,
				cachedData.current_page,
				cachedData.limit,
			);
		}

		const query = this._mountQuery(params);
		const sort = params.sort ?? 'created_at';
		const sortDirection = params.sortDirection ?? SortDirection.DESC;

		let orderBy = {};

		switch (sort) {
			case 'max_depth_level':
			case 'maxDepthLevel':
				orderBy = { max_depth_level: sortDirection };
				break;
			case 'created_at':
			case 'createdAt':
			default:
				orderBy = { created_at: sortDirection };
				break;
		}

		let items = [];

		const paginate = params.paginate ?? false;
		const page = (params.page ?? 1) - 1;
		const limit = params.limit ?? 12;
		const total = await this.countBy(query);

		if (paginate) {
			items = await this.prismaService.postThread.findMany({
				where: query,
				orderBy: orderBy,
				skip: limit * page,
				take: limit,
			});
		} else {
			items = await this.prismaService.postThread.findMany({
				where: query,
				orderBy: orderBy,
			});
		}

		await this._setCachedData(key, new Pagination(items, total, page + 1, limit));

		items = items.map((thread) =>
			this._postThreadEntityMapper.toModel(thread),
		);

		return new Pagination<PostThread>(items, total, page + 1, limit);
	}

	public async findBy(values: Object): Promise<PostThread[]> {
		const key = `post-thread:findBy:${JSON.stringify(values)}`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return cachedData.map((i) => this._postThreadEntityMapper.toModel(i));
		}

		const query = this._mountQuery(values);
		const threads = await this.prismaService.postThread.findMany({
			where: query,
		});

		await this._setCachedData(key, threads);

		return threads.map((thread) =>
			this._postThreadEntityMapper.toModel(thread),
		);
	}

	public async countBy(values: Object): Promise<number> {
		const key = `post-thread:countBy:${JSON.stringify(values)}`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return cachedData;
		}

		const query = this._mountQuery(values);
		const count = await this.prismaService.postThread.count({
			where: query,
		});

		await this._setCachedData(key, count);

		return count;
	}

	public async findAll(): Promise<PostThread[]> {
		const key = `post-thread:findAll`;
		const cachedData = await this._getCachedData(key);

		const threads = await this.prismaService.postThread.findMany();

		await this._setCachedData(key, threads);

		return threads.map((thread) =>
			this._postThreadEntityMapper.toModel(thread),
		);
	}

	public async findById(id: string): Promise<PostThread> {
		const key = `post-thread:findById:${id}`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return this._postThreadEntityMapper.toModel(cachedData);
		}

		const thread = await this.prismaService.postThread.findFirst({
			where: { id: id },
		});

		await this._setCachedData(key, thread);

		return this._postThreadEntityMapper.toModel(thread);
	}

	public async store(model: PostThread): Promise<PostThread> {
		const thread = await this.prismaService.postThread.create({
			data: {
				id: model.id(),
				max_depth_level: model.maxDepthLevel(),
			},
		});

		return this._postThreadEntityMapper.toModel(thread);
	}

	public async update(model: PostThread): Promise<void> {
		const thread = await this.prismaService.postThread.update({
			data: {
				max_depth_level: model.maxDepthLevel(),
			},
			where: {
				id: model.id(),
			},
		});
	}

	public async delete(id: string): Promise<void> {
		await this.prismaService.postThread.delete({
			where: { id: id },
		});
	}
}
