import { Inject, Injectable } from '@nestjs/common';
import { RedisService } from 'src/cache/redis.service';
import {
	PaginateParameters,
	Pagination,
} from 'src/common/core/common.repository';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { GroupRepository } from 'src/group/application/ports/out/group.repository';
import { GroupLog } from 'src/group/domain/group-log.model';
import { GroupVisibilitySettings } from 'src/group/domain/group-visibility-settings.model';
import { Group } from 'src/group/domain/group.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { GroupEntityMapper } from './mappers/group-entity.mapper';
import { GroupLogEntityMapper } from './mappers/group-log-entity.mapper';

@Injectable()
export class GroupRepositoryImpl implements GroupRepository {
	private _groupEntityMapper: GroupEntityMapper = new GroupEntityMapper();
	private _groupLogEntityMapper: GroupLogEntityMapper =
		new GroupLogEntityMapper();

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

	private _mountQuery(values: Object): Object {
		const name = values['name'] ?? null;
		const isDeleted = values['isDeleted'] ?? null;
		const visibility = values['visibility'] ?? null;
		const userId = values['userId'] ?? null;

		let query = {};

		if (name) {
			query['name'] = { contains: name, mode: 'insensitive' };
		}

		if (isDeleted !== undefined && isDeleted !== null) {
			query['is_deleted'] = isDeleted;
		}

		if (visibility) {
			query['visibility'] = visibility;
		}

		if (userId) {
			query['members'] = {
				some: {
					user_id: userId,
				},
			};
		}

		return query;
	}

	public async paginate(
		params: PaginateParameters,
	): Promise<Pagination<Group>> {
		const key = `group:paginate:${JSON.stringify(params)}`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return new Pagination(
				cachedData.items.map((i) => this._groupEntityMapper.toModel(i)),
				cachedData.total,
				cachedData.current_page,
				cachedData.limit,
			);
		}

		const query = this._mountQuery(params.filters);
		const sort = params.sort ?? 'name';
		const sortDirection = params.sortDirection ?? SortDirection.ASC;

		let orderBy = {};

		switch (sort) {
			case 'created_at':
			case 'createdAt':
				orderBy = { created_at: sortDirection };
				break;
			case 'updated_at':
			case 'updatedAt':
				orderBy = { updated_at: sortDirection };
				break;
			case 'name':
			default:
				orderBy = { name: sortDirection };
				break;
		}

		let items = [];

		const paginate = params.paginate ?? false;
		const page = (params.page ?? 1) - 1;
		const limit = params.limit ?? 12;
		const total = await this.countBy(params.filters);

		if (paginate) {
			items = await this.prismaService.group.findMany({
				where: query,
				include: { visibility_settings: true },
				orderBy: orderBy,
				skip: limit * page,
				take: limit,
			});
		} else {
			items = await this.prismaService.group.findMany({
				where: query,
				include: { visibility_settings: true },
				orderBy: orderBy,
			});
		}

		await this._setCachedData(key, new Pagination(items, total, page + 1, limit), 60);

		items = items.map((i) => {
			return this._groupEntityMapper.toModel(i);
		});

		return new Pagination(items, total, page + 1, limit);
	}

	public async findBy(values: Object): Promise<Array<Group>> {
		const key = `group:findBy:${JSON.stringify(values)}`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return cachedData.map((i) => this._groupEntityMapper.toModel(i));
		}

		const query = this._mountQuery(values);
		const groups = await this.prismaService.group.findMany({
			where: query,
			include: { visibility_settings: true },
		});

		await this._setCachedData(key, groups, 60);

		return groups.map((group) => {
			return this._groupEntityMapper.toModel(group);
		});
	}

	public async countBy(values: Object): Promise<number> {
		const key = `group:countBy:${JSON.stringify(values)}`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return cachedData;
		}

		const query = this._mountQuery(values);

		const count = await this.prismaService.group.count({
			where: query,
		});

		await this._setCachedData(key, count, 60);

		return count;
	}

	public async countLogBy(values: Object): Promise<number> {
		const key = `group-log:countBy:${JSON.stringify(values)}`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return cachedData;
		}

		const query = this._mountQuery(values);
		query['group_id'] = values['groupId'] ?? null;

		const count = await this.prismaService.groupLog.count({
			where: query,
		});

		await this._setCachedData(key, count, 60);

		return count;
	}

	public async paginateLog(
		params: PaginateParameters,
	): Promise<Pagination<GroupLog>> {
		const key = `group-log:paginate:${JSON.stringify(params)}`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return new Pagination(
				cachedData.items.map((i) =>
					this._groupLogEntityMapper.toModel(i),
				),
				cachedData.total,
				cachedData.current_page,
				cachedData.limit,
			);
		}

		const query = this._mountQuery(params.filters);
		query['group_id'] = params.filters['groupId'] ?? null;
		const sort = params.sort ?? 'occurredAt';
		const sortDirection = params.sortDirection ?? SortDirection.ASC;

		let orderBy = {};

		switch (sort) {
			case 'text':
				orderBy = { text: sortDirection };
				break;
			case 'occurred_at':
			case 'occurredAt':
			default:
				orderBy = { occurred_at: sortDirection };
				break;
		}

		let items = [];

		const paginate = params.paginate ?? false;
		const page = (params.page ?? 1) - 1;
		const limit = params.limit ?? 12;
		const total = await this.countLogBy(params.filters);

		if (paginate) {
			items = await this.prismaService.groupLog.findMany({
				where: query,
				orderBy: orderBy,
				include: {
					group: {
						include: {
							visibility_settings: true,
						},
					},
				},
				skip: page * limit,
				take: limit,
			});
		} else {
			items = await this.prismaService.groupLog.findMany({
				where: query,
				orderBy: orderBy,
				include: {
					group: {
						include: {
							visibility_settings: true,
						},
					},
				},
			});
		}

		await this._setCachedData(key, new Pagination(items, total, page + 1, limit), 60);

		items = items.map((i) => {
			return this._groupLogEntityMapper.toModel(i);
		});

		return new Pagination(items, total, page + 1, limit);
	}

	public async findAll(): Promise<Array<Group>> {
		const key = 'group:findAll';
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return cachedData.map((i) => this._groupEntityMapper.toModel(i));
		}

		const groups = await this.prismaService.group.findMany({
			include: { visibility_settings: true },
		});

		await this._setCachedData(key, groups, 60);

		return groups.map((group) => {
			return this._groupEntityMapper.toModel(group);
		});
	}

	public async findById(id: string): Promise<Group> {
		const key = `group:findById:${id}`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return cachedData;
		}

		const group = await this.prismaService.group.findFirst({
			where: { id: id },
			include: { visibility_settings: true },
		});

		await this._setCachedData(key, group, 60);

		return this._groupEntityMapper.toModel(group);
	}

	public async store(model: Group): Promise<Group> {
		const group = await this.prismaService.group.create({
			data: {
				id: model.id(),
				name: model.name(),
				about: model.about(),
				group_picture: model.groupPicture(),
				banner_picture: model.bannerPicture(),
				visibility_settings: {
					create: {
						spot_events: model.visibilitySettings().spotEvents(),
						posts: model.visibilitySettings().posts(),
						groups: model.visibilitySettings().groups(),
					},
				},
				created_at: model.createdAt(),
				updated_at: model.updatedAt(),
				is_deleted: model.isDeleted(),
			},
			include: {
				visibility_settings: true,
			},
		});

		return this._groupEntityMapper.toModel(group);
	}

	public async storeLog(model: GroupLog): Promise<GroupLog> {
		const groupLog = await this.prismaService.groupLog.create({
			data: {
				id: model.id(),
				text: model.text(),
				group_id: model.group().id(),
				occurred_at: model.occurredAt(),
			},
			include: {
				group: {
					include: {
						visibility_settings: true,
					},
				},
			},
		});

		return this._groupLogEntityMapper.toModel(groupLog);
	}

	public async update(model: Group): Promise<void> {
		await this.prismaService.group.update({
			data: {
				name: model.name(),
				about: model.about(),
				group_picture: model.groupPicture(),
				banner_picture: model.bannerPicture(),
				is_deleted: model.isDeleted(),
				updated_at: model.updatedAt(),
			},
			where: {
				id: model.id(),
			},
		});
	}

	public async updateVisibilitySettings(
		model: GroupVisibilitySettings,
	): Promise<void> {
		await this.prismaService.group.update({
			data: {
				visibility_settings: {
					update: {
						spot_events: model.spotEvents(),
						groups: model.groups(),
						posts: model.posts(),
					},
				},
			},
			where: { id: model.id() },
		});
	}

	public async delete(id: string): Promise<void> {
		await this.prismaService.group.delete({
			where: { id: id },
		});
	}
}
