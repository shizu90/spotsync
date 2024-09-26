import { GroupMember as GroupMemberPrisma } from "@prisma/client";
import { EntityMapper } from "src/common/core/entity.mapper";
import { GroupMemberStatus } from "src/group/domain/group-member-status.enum";
import { GroupMember } from "src/group/domain/group-member.model";
import { UserEntity, UserEntityMapper } from "src/user/infrastructure/adapters/out/mappers/user-entity.mapper";
import { GroupEntity, GroupEntityMapper } from "./group-entity.mapper";
import { GroupRoleEntity, GroupRoleEntityMapper } from "./group-role-entity.mapper";

export type GroupMemberEntity = GroupMemberPrisma & {group_role?: GroupRoleEntity, group?: GroupEntity, user?: UserEntity};

export class GroupMemberEntityMapper implements EntityMapper<GroupMember, GroupMemberEntity> {
    private _groupRoleEntityMapper: GroupRoleEntityMapper = new GroupRoleEntityMapper();
    private _groupEntityMapper: GroupEntityMapper = new GroupEntityMapper();
    private _userEntityMapper: UserEntityMapper = new UserEntityMapper();

    public toEntity(model: GroupMember): GroupMemberEntity {
        if (model === null || model === undefined) return null;

        return {
            id: model.id(),
            status: model.status(),
            is_creator: model.isCreator(),
            joined_at: model.joinedAt(),
            requested_at: model.requestedAt(),
            group_id: model.group() ? model.group().id() : null,
            group_role_id: model.role() ? model.role().id() : null,
            user_id: model.user() ? model.user().id() : null,
            group: model.group() ? this._groupEntityMapper.toEntity(model.group()) : null,
            group_role: model.role() ? this._groupRoleEntityMapper.toEntity(model.role()) : null,
            user: model.user() ? this._userEntityMapper.toEntity(model.user()) : null,
        };
    }

    public toModel(entity: GroupMemberEntity): GroupMember {
        if (entity === null || entity === undefined) return null;

        return GroupMember.create(
            entity.id,
            entity.group ? this._groupEntityMapper.toModel(entity.group) : null,
            entity.user ? this._userEntityMapper.toModel(entity.user) : null,
            entity.group_role ? this._groupRoleEntityMapper.toModel(entity.group_role) : null,
            entity.is_creator,
            entity.status as GroupMemberStatus,
            entity.joined_at,
            entity.requested_at,
        );
    }
}