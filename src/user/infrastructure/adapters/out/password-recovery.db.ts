import { Inject } from '@nestjs/common';
import * as moment from 'moment';
import { RedisService } from 'src/cache/redis.service';
import {
	PaginateParameters,
	Pagination,
} from 'src/common/core/common.repository';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { PrismaService } from 'src/prisma/prisma.service';
import { PasswordRecoveryRepository } from 'src/user/application/ports/out/password-recovery.repository';
import { PasswordRecovery } from 'src/user/domain/password-recovery.model';
import { PasswordRecoveryEntityMapper } from './mappers/password-recovery-entity.mapper';

export class PasswordRecoveryRepositoryImpl
	implements PasswordRecoveryRepository
{
	private _passwordRecoveryEntityMapper: PasswordRecoveryEntityMapper =
		new PasswordRecoveryEntityMapper();

	public constructor(
		@Inject(PrismaService) protected prismaService: PrismaService,
		@Inject(RedisService) protected redisService: RedisService,
	) {}

	private async _getCachedData(key: string): Promise<any> {
		const data = await this.redisService.get(key);
		
		if (data) return JSON.parse(data, (key, value) => {
			const valid = moment(value, moment.ISO_8601, true).isValid();

			if (valid) return moment(value);
		});

		return null;
	}

	private async _setCachedData(key: string, data: any, ttl: number): Promise<void> {
		await this.redisService.set(key, JSON.stringify(data), "EX", ttl);
	}

	private _mountQuery(params: Object): Object {
		const token = params['token'];
		const userId = params['userId'];
		const status = params['status'];

		let query = {};

		if (token) {
			query['token'] = token;
		}

		if (userId) {
			query['user_id'] = userId;
		}

		if (status) {
			query['status'] = status;
		}

		return query;
	}

	public async paginate(
		params: PaginateParameters,
	): Promise<Pagination<PasswordRecovery>> {
		const key = `password-recoveries:paginate:${JSON.stringify(params)}`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return new Pagination(
				cachedData.items.map((i) => this._passwordRecoveryEntityMapper.toModel(i)),
				cachedData.total,
				cachedData.current_page,
				cachedData.limit,
			)
		}

		const query = this._mountQuery(params.filters);
		const sort = params.sort ?? 'created_at';
		const sortDirection = params.sortDirection ?? SortDirection.DESC;

		let orderBy = {};

		switch (sort) {
			case 'expiredAt':
			case 'expired_at':
				orderBy = { expired_at: sortDirection };
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
		const total = await this.countBy(query);

		if (paginate) {
			items = await this.prismaService.passwordRecovery.findMany({
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
				orderBy: orderBy,
				skip: page * limit,
				take: limit,
			});
		} else {
			items = await this.prismaService.passwordRecovery.findMany({
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
				orderBy: orderBy,
			});
		}

		await this._setCachedData(key, new Pagination(items, total, page + 1, limit), 60);

		items = items.map((i) => {
			return this._passwordRecoveryEntityMapper.toModel(i);
		});

		return new Pagination(items, total, page + 1, limit);
	}

	public async findBy(values: Object): Promise<PasswordRecovery[]> {
		const key = `password-recoveries:findBy:${JSON.stringify(values)}`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return cachedData.map((i) => this._passwordRecoveryEntityMapper.toModel(i));
		}

		const query = this._mountQuery(values);
		const items = await this.prismaService.passwordRecovery.findMany({
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
			return this._passwordRecoveryEntityMapper.toModel(i);
		});
	}
	public async countBy(values: Object): Promise<number> {
		const key = `password-recoveries:countBy:${JSON.stringify(values)}`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return cachedData;
		}

		const token = values['token'];
		const userId = values['userId'];
		const status = values['status'];

		let query = 'SELECT password_recovery.id FROM password_recovery';

		if (token) {
			if (query.includes('WHERE')) {
				query = `${query} AND token = '${token}'`;
			} else {
				query = `${query} WHERE token = '${token}'`;
			}
		}

		if (userId) {
			if (query.includes('WHERE')) {
				query = `${query} AND user_id = '${userId}'`;
			} else {
				query = `${query} WHERE user_id = '${userId}'`;
			}
		}

		if (status) {
			if (query.includes('WHERE')) {
				query = `${query} AND status = '${status}'`;
			} else {
				query = `${query} WHERE status = '${status}'`;
			}
		}

		const ids =
			await this.prismaService.$queryRawUnsafe<{ id: string }[]>(query);

		const count = await this.prismaService.user.count({
			where: { id: { in: ids.map((row) => row.id) } },
		});

		await this._setCachedData(key, count, 60);

		return count;
	}

	public async findById(id: string): Promise<PasswordRecovery> {
		const key = `password-recoveries:findById:${id}`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return this._passwordRecoveryEntityMapper.toModel(cachedData);
		}

		const passwordRecovery =
			await this.prismaService.passwordRecovery.findUnique({
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
		
		await this._setCachedData(key, passwordRecovery, 60);

		return this._passwordRecoveryEntityMapper.toModel(passwordRecovery);
	}
	public async findAll(): Promise<PasswordRecovery[]> {
		const key = 'password-recoveries:findAll';
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return cachedData.map((i) => this._passwordRecoveryEntityMapper.toModel(i));
		}

		const passwordRecoveries =
			await this.prismaService.passwordRecovery.findMany({
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

		await this._setCachedData(key, passwordRecoveries, 60);

		return passwordRecoveries.map((i) => {
			return this._passwordRecoveryEntityMapper.toModel(i);
		});
	}
	public async store(model: PasswordRecovery): Promise<PasswordRecovery> {
		const passwordRecovery =
			await this.prismaService.passwordRecovery.create({
				data: {
					user_id: model.user().id(),
					status: model.status(),
					token: model.token(),
					created_at: model.createdAt(),
					expires_at: model.expiresAt(),
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

		return this._passwordRecoveryEntityMapper.toModel(passwordRecovery);
	}
	public async update(model: PasswordRecovery): Promise<void> {
		await this.prismaService.passwordRecovery.update({
			where: { id: model.id() },
			data: {
				status: model.status(),
				token: model.token(),
				created_at: model.createdAt(),
				expires_at: model.expiresAt(),
			},
		});
	}
	public async delete(id: string): Promise<void> {
		await this.prismaService.passwordRecovery.delete({
			where: { id: id },
		});
	}
}
