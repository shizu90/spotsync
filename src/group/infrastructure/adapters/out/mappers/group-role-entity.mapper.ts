import {
	GroupPermission as GroupPermissionPrisma,
	GroupRolePermission as GroupRolePermissionPrisma,
	GroupRole as GroupRolePrisma,
} from '@prisma/client';
import { EntityMapper } from 'src/common/core/entity.mapper';
import { GroupPermissionName } from 'src/group/domain/group-permission-name.enum';
import { GroupPermission } from 'src/group/domain/group-permission.model';
import { GroupRole } from 'src/group/domain/group-role.model';
import { GroupEntity, GroupEntityMapper } from './group-entity.mapper';

export type GroupRoleEntity = GroupRolePrisma & {
	permissions?: (GroupRolePermissionPrisma & {
		group_permission?: GroupPermissionPrisma;
	})[];
	group?: GroupEntity;
};

export class GroupRoleEntityMapper
	implements EntityMapper<GroupRole, GroupRoleEntity>
{
	private _groupEntityMapper: GroupEntityMapper = new GroupEntityMapper();

	public toEntity(model: GroupRole): GroupRoleEntity {
		if (model === null || model === undefined) return null;

		return {
			id: model.id(),
			name: model.name(),
			hex_color: model.hexColor(),
			is_immutable: model.isImmutable(),
			updated_at: model.updatedAt(),
			created_at: model.createdAt(),
			group_id: model.group() ? model.group().id() : null,
			group: model.group()
				? this._groupEntityMapper.toEntity(model.group())
				: null,
			permissions: model.permissions()
				? model.permissions().map((permission) => ({
						group_permission_id: permission.id(),
						group_role_id: model.id(),
						group_permission: {
							id: permission.id(),
							name: permission.name(),
						},
					}))
				: [],
		};
	}

	public toModel(entity: GroupRoleEntity): GroupRole {
		if (entity === null || entity === undefined) return null;

		return GroupRole.create(
			entity.id,
			entity.name,
			entity.hex_color,
			entity.permissions
				? entity.permissions.map((permission) =>
						GroupPermission.create(
							permission.group_permission
								? permission.group_permission.id
								: null,
							permission.group_permission
								? (permission.group_permission
										.name as GroupPermissionName)
								: null,
						),
					)
				: null,
			entity.is_immutable,
			entity.group ? this._groupEntityMapper.toModel(entity.group) : null,
			entity.created_at,
			entity.updated_at,
		);
	}
}
