import { SpotEventParticipant as SpotEventParticipantPrisma, SpotEvent as SpotEventPrisma } from "@prisma/client";
import { EntityMapper } from "src/common/core/entity.mapper";
import { GroupEntity, GroupEntityMapper } from "src/group/infrastructure/adapters/out/mappers/group-entity.mapper";
import { SpotEventParticipant } from "src/spot-event/domain/spot-event-participant.model";
import { SpotEventStatus } from "src/spot-event/domain/spot-event-status.enum";
import { SpotEventVisibility } from "src/spot-event/domain/spot-event-visibility.enum";
import { SpotEvent } from "src/spot-event/domain/spot-event.model";
import { SpotEntity, SpotEntityMapper } from "src/spot/infrastructure/adapters/out/mappers/spot-entity.mapper";
import { UserEntity, UserEntityMapper } from "src/user/infrastructure/adapters/out/mappers/user-entity.mapper";

export type SpotEventParticipantEntity = SpotEventParticipantPrisma & {user?: UserEntity};
export type SpotEventEntity = SpotEventPrisma & {participants?: SpotEventParticipantEntity[], group?: GroupEntity, creator?: UserEntity, spot?: SpotEntity};

export class SpotEventEntityMapper implements EntityMapper<SpotEvent, SpotEventEntity> {
    private _userEntityMapper: UserEntityMapper = new UserEntityMapper();
    private _groupEntityMapper: GroupEntityMapper = new GroupEntityMapper();
    private _spotEntityMapper: SpotEntityMapper = new SpotEntityMapper();

    public toEntity(model: SpotEvent): SpotEventEntity {
        if (!model) return null;

        return {
            id: model.id(),
            name: model.name(),
            description: model.description(),
            start_date: model.startDate(),
            end_date: model.endDate(),
            status: model.status(),
            spot_id: model.spot()?.id(),
            group_id: model.group()?.id(),
            user_id: model.creator()?.id(),
            created_at: model.createdAt(),
            updated_at: model.updatedAt(),
            visibility: model.visibility(),
            creator: this._userEntityMapper.toEntity(model.creator()),
            group: this._groupEntityMapper.toEntity(model.group()),
            participants: model.participants().map(participant => {
                return {
                    user: this._userEntityMapper.toEntity(participant.user()),
                    spot_event_id: model.id(),
                    user_id: participant.user().id(),
                    participated_at: participant.participatedAt(),
                }
            }),
            spot: this._spotEntityMapper.toEntity(model.spot()),
            notify_minutes: model.notifyMinutes(),
        };
    }

    public toModel(entity: SpotEventEntity): SpotEvent {
        if (!entity) return null;

        return SpotEvent.create(
            entity.id,
            entity.name,
            entity.description,
            entity.start_date,
            entity.end_date,
            this._spotEntityMapper.toModel(entity.spot),
            this._userEntityMapper.toModel(entity.creator),
            entity.notify_minutes,
            entity.participants ? entity.participants.map(participant => SpotEventParticipant.create(
                this._userEntityMapper.toModel(participant.user),
                participant.participated_at,
            )) : [],
            entity.visibility as SpotEventVisibility,
            entity.status as SpotEventStatus,
            this._groupEntityMapper.toModel(entity.group),
            entity.created_at,
            entity.updated_at,
        );
    }
}