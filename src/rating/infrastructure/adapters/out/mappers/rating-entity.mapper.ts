import { Rating as RatingPrisma } from "@prisma/client";
import { EntityMapper } from "src/common/core/entity.mapper";
import { RatableSubject } from "src/rating/domain/ratable-subject.enum";
import { Rating } from "src/rating/domain/rating.model";
import { UserEntity, UserEntityMapper } from "src/user/infrastructure/adapters/out/mappers/user-entity.mapper";

export type RatingEntity = RatingPrisma & {user?: UserEntity};

export class RatingEntityMapper implements EntityMapper<Rating, RatingEntity> {
    private _userEntityMapper: UserEntityMapper = new UserEntityMapper();

    public toEntity(model: Rating): RatingEntity {
        if (!model) return null;



        return {
            id: model.id(),
            subject: model.subject(),
            value: model.value(),
            comment: model.comment(),
            spot_id: model.subject() === RatableSubject.SPOT ? model.subjectId() : null,
            spot_event_id: model.subject() === RatableSubject.SPOT_EVENT ? model.subjectId() : null,
            spot_folder_id: model.subject() === RatableSubject.SPOT_FOLDER ? model.subjectId() : null,
            user: this._userEntityMapper.toEntity(model.user()),
            user_id: model.user().id(),
            created_at: model.createdAt(),
            updated_at: model.updatedAt(),
        };
    }

    public toModel(entity: RatingEntity): Rating {
        if (!entity) return null;

        return Rating.create(
            entity.id,
            entity.value,
            entity.subject as RatableSubject,
            entity.subject === RatableSubject.SPOT ? entity.spot_id : entity.subject === RatableSubject.SPOT_EVENT ? entity.spot_event_id : entity.spot_folder_id,
            this._userEntityMapper.toModel(entity.user),
            entity.comment,
            entity.created_at,
            entity.updated_at,
        );
    }
}