import { SpotEventParticipant as SpotEventParticipantPrisma, SpotEvent as SpotEventPrisma } from "@prisma/client";
import { EntityMapper } from "src/common/core/entity.mapper";
import { GroupEntity } from "src/group/infrastructure/adapters/out/mappers/group-entity.mapper";
import { SpotEvent } from "src/spot-event/domain/spot-event.model";
import { UserEntity } from "src/user/infrastructure/adapters/out/mappers/user-entity.mapper";

export type SpotEventParticipantEntity = SpotEventParticipantPrisma & {user?: UserEntity};
export type SpotEventEntity = SpotEventPrisma & {participants?: SpotEventParticipantEntity[], group?: GroupEntity, creator?: UserEntity};

export class SpotEventEntityMapper implements EntityMapper<SpotEvent, SpotEventEntity> {
    public toEntity(model: SpotEvent): SpotEventEntity {
        return null;
    }

    public toModel(entity: SpotEventEntity): SpotEvent {
        return null;
    }
}