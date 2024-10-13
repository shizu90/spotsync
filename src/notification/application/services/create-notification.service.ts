import { Inject, Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { Notification } from "src/notification/domain/notification.model";
import { UserRepository, UserRepositoryProvider } from "src/user/application/ports/out/user.repository";
import { UserNotFoundError } from "src/user/application/services/errors/user-not-found.error";
import { CreateNotificationCommand } from "../ports/in/commands/create-notification.command";
import { CreateNotificationUseCase } from "../ports/in/use-cases/create-notification.use-case";
import { NotificationDto } from "../ports/out/dto/notification.dto";
import { NotificationRepository, NotificationRepositoryProvider } from "../ports/out/notification.repository";

@Injectable()
export class CreateNotificationService implements CreateNotificationUseCase {
    constructor(
        @Inject(NotificationRepositoryProvider)
        protected notificationRepository: NotificationRepository,
        @Inject(UserRepositoryProvider)
        protected userRepository: UserRepository,
    ) {}

    public async execute(command: CreateNotificationCommand): Promise<NotificationDto> {
        const user = await this.userRepository.findById(command.userId);

        if (!user) {
            throw new UserNotFoundError();
        }

        const notification = Notification.create(
            randomUUID(),
            command.title,
            command.content,
            user,
            command.type,
        );

        await this.notificationRepository.store(notification);

        return NotificationDto.fromModel(notification);
    }
}