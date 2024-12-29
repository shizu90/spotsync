import { Inject, Injectable } from "@nestjs/common";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { ReadNotificationCommand } from "../ports/in/commands/read-notification.command";
import { ReadNotificationUseCase } from "../ports/in/use-cases/read-notification.use-case";
import { NotificationRepository, NotificationRepositoryProvider } from "../ports/out/notification.repository";
import { NotificationNotFoundError } from "./errors/notification-not-found.error";

@Injectable()
export class ReadNotificationService implements ReadNotificationUseCase {
    public constructor(
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
        @Inject(NotificationRepositoryProvider)
        protected notificationRepository: NotificationRepository,
    ) {}

    public async execute(command: ReadNotificationCommand): Promise<void> {
        const user = await this.getAuthenticatedUser.execute(null);

        const notification = await this.notificationRepository.findById(command.id);

        if (!notification) {
            throw new NotificationNotFoundError();
        }

        if (notification.user().id() !== user.id()) {
            throw new NotificationNotFoundError();
        }

        notification.markAsRead();

        await this.notificationRepository.update(notification);
    }
}