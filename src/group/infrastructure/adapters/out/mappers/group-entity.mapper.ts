import {
	Group as GroupPrisma,
	GroupVisibilitySettings as GroupVisibilitySettingsPrisma,
} from '@prisma/client';
import { EntityMapper } from 'src/common/core/entity.mapper';
import { GroupVisibilitySettings } from 'src/group/domain/group-visibility-settings.model';
import { GroupVisibility } from 'src/group/domain/group-visibility.enum';
import { Group } from 'src/group/domain/group.model';

export type GroupEntity = GroupPrisma & {
	visibility_settings?: GroupVisibilitySettingsPrisma;
};

export class GroupEntityMapper implements EntityMapper<Group, GroupEntity> {
	public toEntity(model: Group): GroupEntity {
		if (model === null || model === undefined) return null;

		return {
			id: model.id(),
			name: model.name(),
			about: model.about(),
			banner_picture: model.bannerPicture(),
			group_picture: model.groupPicture(),
			is_deleted: model.isDeleted(),
			created_at: model.createdAt(),
			updated_at: model.updatedAt(),
		};
	}

	public toModel(entity: GroupEntity): Group {
		if (entity === null || entity === undefined) return null;

		return Group.create(
			entity.id,
			entity.name,
			entity.about,
			entity.group_picture,
			entity.banner_picture,
			entity.visibility_settings
				? GroupVisibilitySettings.create(
						entity.id,
						entity.visibility_settings.posts as GroupVisibility,
						entity.visibility_settings
							.spot_events as GroupVisibility,
						entity.visibility_settings.groups as GroupVisibility,
					)
				: null,
		);
	}
}
