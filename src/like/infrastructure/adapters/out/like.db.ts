import { Inject } from '@nestjs/common';
import { env } from 'process';
import { CacheableRepository } from 'src/cache/cacheable.repository';
import { RedisService } from 'src/cache/redis.service';
import {
	PaginateParameters,
	Pagination,
} from 'src/common/core/common.repository';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { LikeRepository } from 'src/like/application/ports/out/like.repository';
import { LikableSubject } from 'src/like/domain/likable-subject.enum';
import { Like } from 'src/like/domain/like.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { LikeEntityMapper } from './mappers/like-entity.mapper';

const REDIS_DB_TTL = env.REDIS_DB_TTL;

export class LikeRepositoryImpl extends CacheableRepository implements LikeRepository {
	private _likeEntityMapper: LikeEntityMapper = new LikeEntityMapper();

	constructor(
		@Inject(PrismaService)
		protected prismaService: PrismaService,
		@Inject(RedisService)
		protected redisService: RedisService,
	) {super(redisService)}

	private _mapSubjectId(subject: LikableSubject): string {
		switch (subject) {
			case LikableSubject.POST:
				return 'post_id';
			case LikableSubject.COMMENT:
				return 'comment_id';
			default:
				return 'post_id';
		}
	}

	private _mountQuery(values: Object): Object {
		const subjectId = values['subjectId'] ?? null;
		const subject = values['subject'] ?? null;
		const userId = values['userId'] ?? null;

		let query = {};

		if (subjectId && subject) {
			query[this._mapSubjectId(subject)] = subjectId;
		}

		if (subject) {
			query['likable_subject'] = subject;
		}

		if (userId) {
			query['user_id'] = userId;
		}

		return query;
	}

	private _mountInclude(): Object {
		return {
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
				},
			},
			comment: {
				include: {
					user: true,
				},
			},
		};
	}

	public async paginate(
		params: PaginateParameters,
	): Promise<Pagination<Like>> {
		const key = `like:paginate:${JSON.stringify(params)}`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return new Pagination(
				cachedData.items.map((i) => this._likeEntityMapper.toModel(i)),
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
			case 'created_at':
			case 'createdAt':
			default:
				orderBy = { created_at: sortDirection };
				break;
		}

		const paginate = params.paginate ?? false;
		const limit = params.limit ?? 12;
		const page = (params.page ?? 1) - 1;
		const total = await this.countBy(params.filters);

		let items = [];

		if (paginate) {
			items = await this.prismaService.like.findMany({
				where: query,
				orderBy: orderBy,
				include: this._mountInclude(),
				skip: limit * page,
				take: limit,
			});
		} else {
			items = await this.prismaService.like.findMany({
				where: query,
				orderBy: orderBy,
				include: this._mountInclude(),
			});
		}

		await this._setCachedData(key, new Pagination(items, total, page + 1, limit));

		return new Pagination(
			items.map((i) => this._likeEntityMapper.toModel(i)),
			total,
			page + 1,
			limit,
		);
	}

	public async findBy(values: Object): Promise<Like[]> {
		const key = `like:findBy:${JSON.stringify(values)}`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return cachedData.map((like) => this._likeEntityMapper.toModel(like));
		}

		const query = this._mountQuery(values);
		const likes = await this.prismaService.like.findMany({
			where: query,
			include: this._mountInclude(),
		});

		await this._setCachedData(key, likes);

		return likes.map((like) => this._likeEntityMapper.toModel(like));
	}

	public async countBy(values: Object): Promise<number> {
		const key = `like:countBy:${JSON.stringify(values)}`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return cachedData;
		}

		const query = this._mountQuery(values);
		const count = await this.prismaService.like.count({
			where: query,
		});

		await this._setCachedData(key, count);

		return count;
	}

	public async findAll(): Promise<Like[]> {
		const key = `like:findAll`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return cachedData.map((like) => this._likeEntityMapper.toModel(like));
		}

		const likes = await this.prismaService.like.findMany({
			include: this._mountInclude(),
		});

		await this._setCachedData(key, likes);

		return likes.map((like) => this._likeEntityMapper.toModel(like));
	}

	public async findById(id: string): Promise<Like> {
		const key = `like:findById:${id}`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return this._likeEntityMapper.toModel(cachedData);
		}

		const like = await this.prismaService.like.findFirst({
			where: { id: id },
			include: this._mountInclude(),
		});

		await this._setCachedData(key, like);

		return this._likeEntityMapper.toModel(like);
	}

	public async store(model: Like): Promise<Like> {
		const like = await this.prismaService.like.create({
			data: {
				id: model.id(),
				post_id:
					model.likableSubject() === LikableSubject.POST
						? model.likable().id()
						: null,
				comment_id:
					model.likableSubject() === LikableSubject.COMMENT
						? model.likable().id()
						: null,
				likable_subject: model.likableSubject(),
				created_at: model.createdAt(),
				user_id: model.user().id(),
			},
			include: this._mountInclude(),
		});

		return this._likeEntityMapper.toModel(like);
	}

	public async update(model: Like): Promise<void> {
		await this.prismaService.like.update({
			where: { id: model.id() },
			data: {
				likable_subject: model.likableSubject(),
				post_id:
					model.likableSubject() === LikableSubject.POST
						? model.likable().id()
						: null,
				comment_id:
					model.likableSubject() === LikableSubject.COMMENT
						? model.likable().id()
						: null,
			},
		});
	}

	public async delete(id: string): Promise<void> {
		await this.prismaService.like.delete({
			where: { id: id },
		});
	}
}
