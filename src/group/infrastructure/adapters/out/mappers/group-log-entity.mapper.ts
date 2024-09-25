import { GroupLog as GroupLogPrisma } from "@prisma/client";
import { EntityMapper } from "src/common/core/entity.mapper";
import { GroupLog } from "src/group/domain/group-log.model";
import { GroupEntity, GroupEntityMapper } from "./group-entity.mapper";

export type GroupLogEntity = GroupLogPrisma & {group?: GroupEntity};

export class GroupLogEntityMapper implements EntityMapper<GroupLog, GroupLogEntity> {
    private _groupEntityMapper: GroupEntityMapper = new GroupEntityMapper();

    public toEntity(model: GroupLog): GroupLogEntity {
        return {
            id: model.id(),
            text: model.text(),
            occurred_at: model.occurredAt(),
            group_id: model.group() ? model.group().id() : null,
            group: model.group() ? this._groupEntityMapper.toEntity(model.group()) : null,
        };
    }

    public toModel(entity: GroupLogEntity): GroupLog {
        return GroupLog.create(
            entity.id,
            entity.group ? this._groupEntityMapper.toModel(entity.group) : null,
            entity.text,
            entity.occurred_at,
        );
    }
}