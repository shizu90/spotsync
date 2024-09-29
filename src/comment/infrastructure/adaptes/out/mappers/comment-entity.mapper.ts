import { Comment as CommentPrisma } from "@prisma/client";
import { CommentSubject } from "src/comment/domain/comment-subject.model.";
import { Comment } from "src/comment/domain/comment.model";
import { EntityMapper } from "src/common/core/entity.mapper";
import { SpotEntity, SpotEntityMapper } from "src/spot/infrastructure/adapters/out/mappers/spot-entity.mapper";
import { UserEntity, UserEntityMapper } from "src/user/infrastructure/adapters/out/mappers/user-entity.mapper";

export type CommentEntity = CommentPrisma & {user?: UserEntity, spot?: SpotEntity};

export class CommentEntityMapper implements EntityMapper<Comment, CommentEntity> {
    private _userEntityMapper: UserEntityMapper = new UserEntityMapper();
    private _spotEntityMapper: SpotEntityMapper = new SpotEntityMapper();

    public toEntity(model: Comment): CommentEntity {
        if (model === null || model === undefined) return null;

        return {
            id: model.id(),
            created_at: model.createdAt(),
            subject: model.subject(),
            spot_id: model.subject() === CommentSubject.SPOT ? model.commentable().id() : null,
            spot_event_id: model.subject() === CommentSubject.SPOT_EVENT ? model.commentable().id() : null,
            user_id: model.user().id(),
            text: model.text(),
            updated_at: model.updatedAt(),
        };
    }

    public toModel(entity: CommentEntity): Comment {
        if (entity === null || entity === undefined) return null;

        return Comment.create(
            entity.id,
            entity.text,
            entity.user ? this._userEntityMapper.toModel(entity.user) : null,
            entity.subject as CommentSubject,
            entity.spot ? this._spotEntityMapper.toModel(entity.spot) : null,
            entity.created_at,
            entity.updated_at,
        );
    }
}