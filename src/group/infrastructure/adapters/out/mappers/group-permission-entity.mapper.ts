import { GroupPermission as GroupPermissionPrisma } from '@prisma/client';
import { EntityMapper } from 'src/common/core/entity.mapper';
import { GroupPermissionName } from 'src/group/domain/group-permission-name.enum';
import { GroupPermission } from 'src/group/domain/group-permission.model';

export type GroupPermissionEntity = GroupPermissionPrisma;

export class GroupPermissionEntityMapper
	implements EntityMapper<GroupPermission, GroupPermissionEntity>
{
	public toEntity(model: GroupPermission): GroupPermissionEntity {
		if (model === null || model === undefined) return null;

		return {
			id: model.id(),
			name: model.name(),
		};
	}

	public toModel(entity: GroupPermissionEntity): GroupPermission {
		if (entity === null || entity === undefined) return null;

		return GroupPermission.create(
			entity.id,
			entity.name as GroupPermissionName,
		);
	}
}
