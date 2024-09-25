import { ActivationRequest as ActivationRequestPrisma } from "@prisma/client";
import { EntityMapper } from "src/common/core/entity.mapper";
import { ActivationRequestStatus } from "src/user/domain/activation-request-status.enum";
import { ActivationRequestSubject } from "src/user/domain/activation-request-subject.enum";
import { ActivationRequest } from "src/user/domain/activation-request.model";
import { UserEntity, UserEntityMapper } from "./user-entity.mapper";

export type ActivationRequestEntity = ActivationRequestPrisma & {user?: UserEntity};

export class ActivationRequestEntityMapper implements EntityMapper<ActivationRequest, ActivationRequestEntity> {
    private _userEntityMapper: UserEntityMapper = new UserEntityMapper();

    public toEntity(model: ActivationRequest): ActivationRequestEntity {
        return {
            id: model.id(),
            code: model.code(),
            requested_at: model.requestedAt(),
            status: model.status(),
            subject: model.subject(),
            user_id: model.user() ? model.user().id() : null,
            user: model.user() ? this._userEntityMapper.toEntity(model.user()) : null
        };
    }

    public toModel(entity: ActivationRequestEntity): ActivationRequest {
        return ActivationRequest.create(
            entity.id,
            entity.user ? this._userEntityMapper.toModel(entity.user) : null,
            entity.subject as ActivationRequestSubject,
            entity.code,
            entity.status as ActivationRequestStatus,
            entity.requested_at,
        );
    }
}