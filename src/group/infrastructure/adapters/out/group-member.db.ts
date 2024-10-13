import { Inject, Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { env } from 'process';
import { RedisService } from 'src/cache/redis.service';
import {
	PaginateParameters,
	Pagination,
} from 'src/common/core/common.repository';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { GroupMemberRepository } from 'src/group/application/ports/out/group-member.repository';
import { GroupMember } from 'src/group/domain/group-member.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { GroupMemberEntityMapper } from './mappers/group-member.mapper';

const REDIS_DB_TTL = env.REDIS_DB_TTL;

@Injectable()
export class GroupMemberRepositoryImpl implements GroupMemberRepository {
	private _groupMemberEntityMapper: GroupMemberEntityMapper =
		new GroupMemberEntityMapper();

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

	private _mountQuery(values: Object): Object {
		const name = values['name'] ?? null;
		const status = values['status'] ?? null;
		const roleId = values['roleId'] ?? null;
		const groupId = values['groupId'] ?? null;
		const userId = values['userId'] ?? null;

		let query = {};

		if (name) {
			query['name'] = { contains: name, mode: 'insensitive' };
		}

		if (roleId) {
			query['role_id'] = roleId;
		}

		if (groupId) {
			query['group_id'] = groupId;
		}

		if (userId) {
			query['user_id'] = userId;
		}

		if (status) {
			query['status'] = status;
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
			group_role: {
				include: {
					permissions: {
						include: {
							group_permission: true,
						},
					},
				},
			},
			group: {
				include: {
					visibility_settings: true,
				},
			},
		};
	}

	public async paginate(
		params: PaginateParameters,
	): Promise<Pagination<GroupMember>> {
		const key = `group-member:paginate:${JSON.stringify(params)}`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return new Pagination(
				cachedData.items.map((i) => this._groupMemberEntityMapper.toModel(i)),
				cachedData.total,
				cachedData.current_page,
				cachedData.limit,
			);
		}

		const query = this._mountQuery(params);
		const sort = params.sort ?? 'name';
		const sortDirection = params.sortDirection ?? SortDirection.ASC;

		let orderBy = {};

		switch (sort) {
			case 'name':
				orderBy = { user: { credentials: { name: sortDirection } } };
				break;
			case 'joined_at':
			case 'joinedAt':
			default:
				orderBy = { joined_at: sortDirection };
				break;
		}

		let items = [];

		const paginate = params.paginate ?? false;
		const page = (params.page ?? 1) - 1;
		const limit = params.limit ?? 12;
		const total = await this.countBy(params.filters);

		if (paginate) {
			items = await this.prismaService.groupMember.findMany({
				where: query,
				orderBy: orderBy,
				include: this._mountInclude(),
				skip: page * limit,
				take: limit,
			});
		} else {
			items = await this.prismaService.groupMember.findMany({
				where: query,
				orderBy: orderBy,
				include: this._mountInclude(),
			});
		}

		await this._setCachedData(key, new Pagination(items, total, page + 1, limit));

		items = items.map((i) => {
			return this._groupMemberEntityMapper.toModel(i);
		});

		return new Pagination(items, total, page + 1, limit);
	}

	public async findBy(values: Object): Promise<Array<GroupMember>> {
		const key = `group-member:findBy:${JSON.stringify(values)}`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return cachedData.map((i) => this._groupMemberEntityMapper.toModel(i));
		}

		const query = this._mountQuery(values);
		const groupMembers = await this.prismaService.groupMember.findMany({
			where: query,
			include: this._mountInclude(),
		});

		await this._setCachedData(key, groupMembers);

		return groupMembers.map((gm) => {
			return this._groupMemberEntityMapper.toModel(gm);
		});
	}

	public async countBy(values: Object): Promise<number> {
		const key = `group-member:countBy:${JSON.stringify(values)}`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return cachedData;
		}

		const query = this._mountQuery(values);
		const count = await this.prismaService.groupMember.count({
			where: query,
		});

		await this._setCachedData(key, count);

		return count;
	}

	public async findAll(): Promise<Array<GroupMember>> {
		const key = `group-member:findAll`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return cachedData.map((i) => this._groupMemberEntityMapper.toModel(i));
		}

		const groupMembers = await this.prismaService.groupMember.findMany({
			include: this._mountInclude(),
		});

		await this._setCachedData(key, groupMembers);

		return groupMembers.map((gm) => {
			return this._groupMemberEntityMapper.toModel(gm);
		});
	}

	public async findById(id: string): Promise<GroupMember> {
		const key = `group-member:findById:${id}`;
		const cachedData = await this._getCachedData(key);

		if (cachedData) {
			return this._groupMemberEntityMapper.toModel(cachedData);
		}

		const groupMember = await this.prismaService.groupMember.findFirst({
			where: { id: id },
			include: this._mountInclude(),
		});

		await this._setCachedData(key, groupMember);

		return this._groupMemberEntityMapper.toModel(groupMember);
	}

	public async store(model: GroupMember): Promise<GroupMember> {
		const groupMember = await this.prismaService.groupMember.create({
			data: {
				group_id: model.group().id(),
				user_id: model.user().id(),
				is_creator: model.isCreator(),
				group_role_id: model.role().id(),
				id: model.id(),
				joined_at: model.joinedAt(),
				requested_at: model.requestedAt(),
				status: model.status(),
			},
			include: this._mountInclude(),
		});

		return this._groupMemberEntityMapper.toModel(groupMember);
	}

	public async update(model: GroupMember): Promise<void> {
		await this.prismaService.groupMember.update({
			data: {
				group_role_id: model.role().id(),
				status: model.status(),
				requested_at: model.requestedAt(),
				joined_at: model.joinedAt(),
			},
			where: { id: model.id() },
		});
	}

	public async delete(id: string): Promise<void> {
		await this.prismaService.groupMember.delete({
			where: { id: id },
		});
	}
}
