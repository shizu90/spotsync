import { Inject } from '@nestjs/common';
import { CacheableRepository } from 'src/cache/cacheable.repository';
import { RedisService } from 'src/cache/redis.service';
import {
	PaginateParameters,
	Pagination,
} from 'src/common/core/common.repository';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { FollowRepository } from 'src/follower/application/ports/out/follow.repository';
import { Follow } from 'src/follower/domain/follow.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { FollowEntityMapper } from './mappers/follow-entity.mapper';

export class FollowRepositoryImpl extends CacheableRepository implements FollowRepository {
	private _followEntityMapper: FollowEntityMapper = new FollowEntityMapper();

	constructor(
		@Inject(PrismaService)
		protected prismaService: PrismaService,
		@Inject(RedisService)
		protected redisService: RedisService,
	) {super(redisService)}

	private _mountQuery(values: Object): Object {
		const status = values['status'] ?? null;
		const fromUserId = values['fromUserId'] ?? null;
		const toUserId = values['toUserId'] ?? null;

		let query = {};

		if (status) {
			query['status'] = status;
		}

		if (fromUserId) {
			query['from_user_id'] = fromUserId;
		}

		if (toUserId) {
			query['to_user_id'] = toUserId;
		}

		return query;
	}

	private _mountInclude(): Object {
		return {
			from_user: {
				include: {
					credentials: true,
					visibility_settings: true,
					profile: true,
				},
			},
			to_user: {
				include: {
					credentials: true,
					visibility_settings: true,
					profile: true,
				},
			},
		};
	}

	public async paginate(
		params: PaginateParameters,
	): Promise<Pagination<Follow>> {
		const key = `follow:paginate:${JSON.stringify(params)}`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return new Pagination(
				cachedData.items.map((i) => this._followEntityMapper.toModel(i)),
				cachedData.total,
				cachedData.current_page,
				cachedData.limit,
			);
		}
		
		const query = this._mountQuery(params.filters);
		const sort = params.sort ?? 'followedAt';
		const sortDirection = params.sortDirection ?? SortDirection.ASC;

		let orderBy = {};

		switch (sort) {
			case 'followed_at':
			case 'followedAt':
			default:
				orderBy = {
					followed_at: sortDirection,
				};
				break;
		}

		let items = [];

		const paginate = params.paginate ?? false;
		const page = (params.page ?? 1) - 1;
		const limit = params.limit ?? 12;
		const total = await this.countBy(params.filters);

		if (paginate) {
			items = await this.prismaService.follow.findMany({
				where: query,
				orderBy: orderBy,
				include: this._mountInclude(),
				skip: limit * page,
				take: limit,
			});
		} else {
			items = await this.prismaService.follow.findMany({
				where: query,
				orderBy: orderBy,
				include: this._mountInclude(),
			});
		}

		await this._setCachedData(key, new Pagination(items, total, page + 1, limit));

		items = items.map((i) => {
			return this._followEntityMapper.toModel(i);
		});

		return new Pagination(items, total, page + 1, limit);
	}

	public async findBy(values: Object): Promise<Array<Follow>> {
		const key = `follow:findBy:${JSON.stringify(values)}`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return cachedData.map((i) => this._followEntityMapper.toModel(i));
		}

		const query = this._mountQuery(values);
		const follows = await this.prismaService.follow.findMany({
			where: query,
			include: this._mountInclude(),
		});

		await this._setCachedData(key, follows);

		return follows.map((follow) => {
			return this._followEntityMapper.toModel(follow);
		});
	}

	public async countBy(values: Object) {
		const key = `follow:countBy:${JSON.stringify(values)}`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return cachedData;
		}

		const query = this._mountQuery(values);
		const count = await this.prismaService.follow.count({
			where: query,
		});

		await this._setCachedData(key, count);

		return count;
	}

	public async findAll(): Promise<Array<Follow>> {
		const key = `follow:findAll`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return cachedData.map((i) => this._followEntityMapper.toModel(i));
		}

		const follows = await this.prismaService.follow.findMany({
			include: this._mountInclude(),
		});

		await this._setCachedData(key, follows);

		return follows.map((follow) => {
			return this._followEntityMapper.toModel(follow);
		});
	}

	public async findById(id: string): Promise<Follow> {
		const key = `follow:findById:${id}`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return this._followEntityMapper.toModel(cachedData);
		}

		const follow = await this.prismaService.follow.findFirst({
			where: {
				id: id,
			},
			include: this._mountInclude(),
		});

		await this._setCachedData(key, follow);

		return this._followEntityMapper.toModel(follow);
	}

	public async store(model: Follow): Promise<Follow> {
		const follow = await this.prismaService.follow.create({
			data: {
				id: model.id(),
				from_user_id: model.from().id(),
				to_user_id: model.to().id(),
				followed_at: model.followedAt(),
				status: model.status(),
				requested_at: model.requestedAt(),
			},
			include: this._mountInclude(),
		});

		return this._followEntityMapper.toModel(follow);
	}

	public async update(model: Follow): Promise<void> {
		await this.prismaService.follow.update({
			where: { id: model.id() },
			data: {
				from_user_id: model.from().id(),
				to_user_id: model.to().id(),
				followed_at: model.followedAt(),
				status: model.status(),
				requested_at: model.requestedAt(),
			}
		});
	}

	public async delete(id: string): Promise<void> {
		await this.prismaService.follow.delete({
			where: {
				id: id,
			},
		});
	}
}
