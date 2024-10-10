import { Inject, Injectable } from '@nestjs/common';
import { RedisService } from 'src/cache/redis.service';
import {
	PaginateParameters,
	Pagination,
} from 'src/common/core/common.repository';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { PrismaService } from 'src/prisma/prisma.service';
import { ActivationRequestRepository } from 'src/user/application/ports/out/activation-request.repository';
import { ActivationRequest } from 'src/user/domain/activation-request.model';
import { ActivationRequestEntityMapper } from './mappers/activation-request-entity.mapper';

@Injectable()
export class ActivationRequestRepositoryImpl
	implements ActivationRequestRepository
{
	private _activationRequestEntityMapper: ActivationRequestEntityMapper =
		new ActivationRequestEntityMapper();

	constructor(
		@Inject(PrismaService)
		protected prismaService: PrismaService,
		@Inject(RedisService)
		protected redisService: RedisService,
	) {}

	private async _getCachedData(key: string): Promise<any> {
		const data = await this.redisService.get(key);
		
		if (data) return JSON.parse(data, (key, value) => {
			const date = new Date(value);

			if (date instanceof Date && !isNaN(date.getTime())) {
				return date;
			}
		});

		return null;
	}

	private async _setCachedData(key: string, data: any, ttl: number): Promise<void> {
		await this.redisService.set(key, JSON.stringify(data), "EX", ttl);
	}

	private _mountQuery(params: Object): Object {
		const status = params['status'];
		const subject = params['subject'];
		const code = params['code'];
		const userId = params['userId'];

		let query = {};

		if (status) {
			query['status'] = status;
		}

		if (subject) {
			query['subject'] = subject;
		}

		if (code) {
			query['code'] = code;
		}

		if (userId) {
			query['user_id'] = userId;
		}

		return query;
	}

	public async paginate(
		params: PaginateParameters,
	): Promise<Pagination<ActivationRequest>> {
		const key = `activation-requests:${JSON.stringify(params)}`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return new Pagination(
				cachedData.items.map((i) => this._activationRequestEntityMapper.toModel(i)),
				cachedData.total,
				cachedData.page,
				cachedData.limit,
			);
		}

		const query = this._mountQuery(params.filters);
		const sort = params.sort ?? 'requested_at';
		const sortDirection = params.sortDirection ?? SortDirection.DESC;

		let orderBy = {};

		switch (sort) {
			case 'requestedAt':
			case 'requested_at':
			default:
				orderBy = { requested_at: sortDirection };
				break;
		}

		let items = [];

		const paginate = params.paginate ?? false;
		const page = (params.page ?? 1) - 1;
		const limit = params.limit ?? 12;
		const total = await this.countBy(query);

		if (paginate) {
			items = await this.prismaService.activationRequest.findMany({
				where: query,
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
			items = await this.prismaService.user.findMany({
				where: query,
				orderBy: orderBy,
				include: {
					credentials: true,
					visibility_settings: true,
				},
			});
		}

		await this._setCachedData(key, new Pagination(items, total, page + 1, limit), 60);

		items = items.map((i) => {
			return this._activationRequestEntityMapper.toModel(i);
		});

		return new Pagination(items, total, page + 1, limit);
	}

	public async findBy(values: Object): Promise<any[]> {
		const key = `activation-requests:${JSON.stringify(values)}`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return cachedData.map((i) => this._activationRequestEntityMapper.toModel(i));
		}

		const query = this._mountQuery(values);
		const items = await this.prismaService.activationRequest.findMany({
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

		await this._setCachedData(key, items, 60);

		return items.map((i) => {
			return this._activationRequestEntityMapper.toModel(i);
		});
	}
	public async countBy(values: Object): Promise<number> {
		const key = `activation-requests:countBy:${JSON.stringify(values)}`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return cachedData;
		}

		const query = this._mountQuery(values);
		const count = await this.prismaService.activationRequest.count({
			where: query
		});

		await this._setCachedData(key, count, 60);

		return count;
	}

	public async findById(id: string): Promise<ActivationRequest> {
		const key = `activation-requests:${id}`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return this._activationRequestEntityMapper.toModel(cachedData);
		}

		const item = await this.prismaService.activationRequest.findFirst({
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

		await this._setCachedData(key, item, 60);

		return this._activationRequestEntityMapper.toModel(item);
	}

	public async findAll(): Promise<ActivationRequest[]> {
		const key = 'activation-requests:findAll';
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return cachedData.map((i) => this._activationRequestEntityMapper.toModel(i));
		}

		const items = await this.prismaService.activationRequest.findMany({
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

		await this._setCachedData(key, items, 60);

		return items.map((i) => {
			return this._activationRequestEntityMapper.toModel(i);
		});
	}

	public async store(model: ActivationRequest): Promise<ActivationRequest> {
		const item = await this.prismaService.activationRequest.create({
			data: {
				id: model.id(),
				user_id: model.user().id(),
				status: model.status(),
				subject: model.subject(),
				code: model.code(),
				requested_at: model.requestedAt(),
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

		return this._activationRequestEntityMapper.toModel(item);
	}

	public async update(model: ActivationRequest): Promise<void> {
		await this.prismaService.activationRequest.update({
			where: { id: model.id() },
			data: {
				user_id: model.user().id(),
				status: model.status(),
				subject: model.subject(),
				code: model.code(),
				requested_at: model.requestedAt(),
			},
		});
	}

	public async delete(id: string): Promise<void> {
		await this.prismaService.activationRequest.delete({
			where: { id: id },
		});
	}
}
