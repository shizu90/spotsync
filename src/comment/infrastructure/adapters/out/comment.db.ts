import { Inject, Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { env } from 'process';
import { RedisService } from 'src/cache/redis.service';
import { CommentRepository } from 'src/comment/application/ports/out/comment.repository';
import { Comment } from 'src/comment/domain/comment.model';
import { CommentableSubject } from 'src/comment/domain/commentable-subject.enum';
import {
	PaginateParameters,
	Pagination,
} from 'src/common/core/common.repository';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommentEntityMapper } from './mappers/comment-entity.mapper';

const REDIS_DB_TTL = env.REDIS_DB_TTL;

@Injectable()
export class CommentRepositoryImpl implements CommentRepository {
	private _commentEntityMapper: CommentEntityMapper =
		new CommentEntityMapper();

	constructor(
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

	private _mapCommentableId(subject: CommentableSubject): string {
		switch (subject) {
			case CommentableSubject.SPOT:
				return 'spot_id';
			case CommentableSubject.SPOT_EVENT:
				return 'spot_event_id';
			default:
				return '';
		}
	}

	private _mountQuery(values: Object): Object {
		const subject = values['subject'];
		const subjectId = values['subjectId'];
		const userId = values['userId'];

		let query = {};

		if (subject) {
			query['subject'] = subject;
		}

		if (subjectId && subject) {
			query[this._mapCommentableId(subject)] = subjectId;
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
					profile: true,
					credentials: true,
					visibility_settings: true,
				},
			},
			spot: {
				include: {
					address: true,
					attachments: true,
					creator: {
						include: {
							profile: true,
							credentials: true,
							visibility_settings: true,
						},
					},
				},
			},
		};
	}

	public async paginate(
		params: PaginateParameters,
	): Promise<Pagination<Comment>> {
		const key = `comment:paginate:${JSON.stringify(params)}`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return new Pagination(
				cachedData.items.map((i) => this._commentEntityMapper.toModel(i)),
				cachedData.total,
				cachedData.page,
				cachedData.limit,
			);
		}

		const query = this._mountQuery(params.filters);
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

		let items = [];

		const page = (params.page ?? 1) - 1;
		const paginate = params.paginate ?? false;
		const limit = params.limit ?? 12;
		const total = await this.countBy(params.filters);

		if (paginate) {
			items = await this.prismaService.comment.findMany({
				where: query,
				orderBy: orderBy,
				include: this._mountInclude(),
				skip: limit * page,
				take: limit,
			});
		} else {
			items = await this.prismaService.comment.findMany({
				where: query,
				orderBy: orderBy,
				include: this._mountInclude(),
			});
		}

		await this._setCachedData(key, new Pagination(items, total, page + 1, limit));

		return new Pagination(
			items.map((i) => this._commentEntityMapper.toModel(i)),
			total,
			page,
			limit,
		);
	}

	public async findBy(values: Object): Promise<Comment[]> {
		const key = `comment:findBy:${JSON.stringify(values)}`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return cachedData.map((i) => this._commentEntityMapper.toModel(i));
		}

		const query = this._mountQuery(values);

		const items = await this.prismaService.comment.findMany({
			where: query,
			include: this._mountInclude(),
		});

		await this._setCachedData(key, items);

		return items.map((i) => this._commentEntityMapper.toModel(i));
	}

	public async countBy(values: Object): Promise<number> {
		const key = `comment:countBy:${JSON.stringify(values)}`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return cachedData;
		}

		const query = this._mountQuery(values);
		const count = await this.prismaService.comment.count({
			where: query,
		});

		await this._setCachedData(key, count);

		return count;
	}

	public async findById(id: string): Promise<Comment> {
		const key = `comment:findById:${id}`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return this._commentEntityMapper.toModel(cachedData);
		}

		const item = await this.prismaService.comment.findFirst({
			where: {
				id: id,
			},
			include: this._mountInclude(),
		});

		await this._setCachedData(key, item);

		return this._commentEntityMapper.toModel(item);
	}

	public async findAll(): Promise<Comment[]> {
		const key = `comment:findAll`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return cachedData.map((i) => this._commentEntityMapper.toModel(i));
		}

		const items = await this.prismaService.comment.findMany({
			include: this._mountInclude(),
		});

		await this._setCachedData(key, items);

		return items.map((i) => this._commentEntityMapper.toModel(i));
	}

	public async store(model: Comment): Promise<Comment> {
		const item = await this.prismaService.comment.create({
			data: {
				id: model.id(),
				text: model.text(),
				user_id: model.user().id(),
				subject: model.subject(),
				spot_id:
					model.subject() === CommentableSubject.SPOT
						? model.commentable().id()
						: null,
				created_at: model.createdAt(),
				updated_at: model.updatedAt(),
			},
			include: this._mountInclude(),
		});

		return this._commentEntityMapper.toModel(item);
	}

	public async update(model: Comment): Promise<void> {
		await this.prismaService.comment.update({
			where: {
				id: model.id(),
			},
			data: {
				text: model.text(),
				updated_at: model.updatedAt(),
			},
		});
	}

	public async delete(id: string): Promise<void> {
		await this.prismaService.comment.delete({
			where: {
				id: id,
			},
		});
	}
}
