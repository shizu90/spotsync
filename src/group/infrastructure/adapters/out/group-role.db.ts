import { Inject, Injectable } from '@nestjs/common';
import {
	PaginateParameters,
	Pagination,
} from 'src/common/core/common.repository';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { GroupRoleRepository } from 'src/group/application/ports/out/group-role.repository';
import { GroupPermission } from 'src/group/domain/group-permission.model';
import { GroupRole } from 'src/group/domain/group-role.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { GroupPermissionEntityMapper } from './mappers/group-permission-entity.mapper';
import { GroupRoleEntityMapper } from './mappers/group-role-entity.mapper';

@Injectable()
export class GroupRoleRepositoryImpl implements GroupRoleRepository {
	private _groupRoleEntityMapper: GroupRoleEntityMapper = new GroupRoleEntityMapper();
	private _groupPermissionEntityMapper: GroupPermissionEntityMapper = new GroupPermissionEntityMapper();
	
	constructor(
		@Inject(PrismaService)
		protected prismaService: PrismaService,
	) {}

	public async paginate(
		params: PaginateParameters,
	): Promise<Pagination<GroupRole>> {
		let query = `SELECT id FROM group_roles`;

		if (params.filters) {
			if (typeof params.filters['name'] === 'string') {
				const name = params.filters['name'];
				if (query.includes('WHERE')) {
					query = `${query} AND LOWER(name) = '${name.toLowerCase()}'`;
				} else {
					query = `${query} WHERE LOWER(name) = '${name.toLowerCase()}'`;
				}
			}

			if (typeof params.filters['isImmutable'] === 'boolean') {
				const isImmutable = params.filters['isImmutable'];
				if (query.includes('WHERE')) {
					query = `${query} AND is_immutable = ${isImmutable}`;
				} else {
					query = `${query} WHERE is_immutable = ${isImmutable}`;
				}
			}

			if (typeof params.filters['groupId'] === 'string') {
				const groupId = params.filters['groupId'];
				if (query.includes('WHERE')) {
					query = `${query} AND (group_id = '${groupId}' OR group_id IS null)`;
				} else {
					query = `${query} WHERE (group_id = '${groupId}' OR group_id is null)`;
				}
			}
		}

		const ids =
			await this.prismaService.$queryRawUnsafe<{ id: string }[]>(query);

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
		const page = (params.page ?? 1)-1;
		const limit = params.limit ?? 12;
		const total = ids.length;

		if (paginate) {
			items = await this.prismaService.groupRole.findMany({
				where: { id: { in: ids.map((row) => row.id) } },
				include: {
					permissions: { include: { group_permission: true } },
					group: {
						include: {
							visibility_settings: true,
						},
					},
				},
				orderBy: orderBy,
				skip: limit * page,
				take: limit,
			});
		} else {
			items = await this.prismaService.groupRole.findMany({
				where: { id: { in: ids.map((row) => row.id) } },
				include: {
					permissions: { include: { group_permission: true } },
					group: {
						include: {
							visibility_settings: true,
						},
					},
				},
				orderBy: orderBy,
			});
		}

		items = items.map((i) => {
			return this._groupRoleEntityMapper.toModel(i);
		});

		return new Pagination(items, total, page+1, limit);
	}

	public async findBy(values: Object): Promise<Array<GroupRole>> {
		const name = values['name'];
		const isImmutable = values['isImmutable'];
		const groupId = values['groupId'];

		let query = 'SELECT group_roles.id FROM group_roles';

		if (name) {
			if (query.includes('WHERE')) {
				query = `${query} AND LOWER(name) = '${name.toLowerCase()}'`;
			} else {
				query = `${query} WHERE LOWER(name) = '${name.toLowerCase()}'`;
			}
		}

		if (isImmutable) {
			if (query.includes('WHERE')) {
				query = `${query} AND is_immutable = ${isImmutable}`;
			} else {
				query = `${query} WHERE is_immutable = ${isImmutable}`;
			}
		}

		if (groupId) {
			if (query.includes('WHERE')) {
				query = `${query} AND (group_id = '${groupId}' OR group_id IS null)`;
			} else {
				query = `${query} WHERE (group_id = '${groupId}' OR group_id IS null)`;
			}
		}

		const groupRoleIds =
			await this.prismaService.$queryRawUnsafe<{ id: string }[]>(query);

		const groupRoles = await this.prismaService.groupRole.findMany({
			where: { id: { in: groupRoleIds.map((row) => row.id) } },
			include: {
				permissions: { include: { group_permission: true } },
				group: {
					include: {
						visibility_settings: true,
					},
				},
			},
		});

		return groupRoles.map((groupRole) => {
			return this._groupRoleEntityMapper.toModel(groupRole);
		});
	}

	public async countBy(values: Object): Promise<number> {
		const name = values['name'];
		const isImmutable = values['isImmutable'];
		const groupId = values['groupId'];

		let query = 'SELECT group_roles.id FROM group_roles';

		if (name) {
			if (query.includes('WHERE')) {
				query = `${query} AND LOWER(name) = '${name.toLowerCase()}'`;
			} else {
				query = `${query} WHERE LOWER(name) = '${name.toLowerCase()}'`;
			}
		}

		if (isImmutable) {
			if (query.includes('WHERE')) {
				query = `${query} AND is_immutable = ${isImmutable}`;
			} else {
				query = `${query} WHERE is_immutable = ${isImmutable}`;
			}
		}

		if (groupId) {
			if (query.includes('WHERE')) {
				query = `${query} AND (group_id = '${groupId}' OR group_id IS null)`;
			} else {
				query = `${query} WHERE (group_id = '${groupId}' OR group_id IS null)`;
			}
		}

		const groupRoleIds =
			await this.prismaService.$queryRawUnsafe<{ id: string }[]>(query);

		const count = await this.prismaService.groupRole.count({
			where: { id: { in: groupRoleIds.map((row) => row.id) } },
		});

		return count;
	}

	public async findAll(): Promise<Array<GroupRole>> {
		const groupRoles = await this.prismaService.groupRole.findMany({
			include: {
				permissions: { include: { group_permission: true } },
				group: {
					include: {
						visibility_settings: true,
					},
				},
			},
		});

		return groupRoles.map((groupRole) => {
			return this._groupRoleEntityMapper.toModel(groupRole);
		});
	}

	public async findById(id: string): Promise<GroupRole> {
		const groupRole = await this.prismaService.groupRole.findFirst({
			where: { id: id },
			include: {
				permissions: { include: { group_permission: true } },
				group: {
					include: {
						visibility_settings: true,
					},
				},
			},
		});

		return this._groupRoleEntityMapper.toModel(groupRole);
	}

	public async findByName(name: string): Promise<GroupRole> {
		const groupRole = await this.prismaService.groupRole.findFirst({
			where: { name: name },
			include: {
				permissions: { include: { group_permission: true } },
				group: {
					include: {
						visibility_settings: true,
					},
				},
			},
		});

		return this._groupRoleEntityMapper.toModel(groupRole);
	}

	public async findPermissionById(id: string): Promise<GroupPermission> {
		const groupPermission =
			await this.prismaService.groupPermission.findFirst({
				where: { id: id },
			});

		return this._groupPermissionEntityMapper.toModel(groupPermission);
	}

	public async store(model: GroupRole): Promise<GroupRole> {
		const groupRole = await this.prismaService.groupRole.create({
			data: {
				id: model.id(),
				name: model.name(),
				hex_color: model.hexColor(),
				is_immutable: model.isImmutable(),
				created_at: model.createdAt(),
				updated_at: model.updatedAt(),
				permissions: {
					createMany: {
						data: model.permissions().map((p) => {
							return { group_permission_id: p.id() };
						}),
					},
				},
				group_id: model.group().id(),
			},
			include: {
				permissions: { include: { group_permission: true } },
				group: {
					include: {
						visibility_settings: true,
					},
				},
			},
		});

		return this._groupRoleEntityMapper.toModel(groupRole);
	}

	public async update(model: GroupRole): Promise<void> {
		await this.prismaService.groupRole.update({
			where: { id: model.id() },
			data: {
				name: model.name(),
				hex_color: model.hexColor(),
				updated_at: model.updatedAt(),
			},
			include: {
				permissions: { include: { group_permission: true } },
				group: {
					include: {
						visibility_settings: true,
					},
				},
			},
		});
	}

	public async delete(id: string): Promise<void> {
		await this.prismaService.groupRole.delete({
			where: { id: id },
		});
	}
}
