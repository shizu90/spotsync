import { Notification as NotificationPrisma } from "@prisma/client";
import { EntityMapper } from "src/common/core/entity.mapper";
import { NotificationStatus } from "src/notification/domain/notification-status.enum";
import { NotificationType } from "src/notification/domain/notification-type.enum";
import { Notification } from "src/notification/domain/notification.model";
import { UserEntity, UserEntityMapper } from "src/user/infrastructure/adapters/out/mappers/user-entity.mapper";

export type NotificationEntity = NotificationPrisma & {user: UserEntity}; 

export class NotificationEntityMapper implements EntityMapper<Notification, NotificationEntity> {
    private _userEntityMapper: UserEntityMapper = new UserEntityMapper();

    public toEntity(model: Notification): NotificationEntity {
        return {
            id: model.id(),
            content: model.content(),
            title: model.title(),
            status: model.status(),
            type: model.type(),
            read_at: model.readAt(),
            created_at: model.createdAt(),
            user_id: model.user().id(),
            user: this._userEntityMapper.toEntity(model.user())
        };
    }

    public toModel(entity: NotificationEntity): Notification {
        return Notification.create(
            entity.id,
            entity.title,
            entity.content,
            entity.user ? this._userEntityMapper.toModel(entity.user) : null,
            entity.type as NotificationType,
            entity.status as NotificationStatus,
            entity.read_at,
            entity.created_at,
        );
    }
}