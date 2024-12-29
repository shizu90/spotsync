import { Inject, Injectable } from "@nestjs/common";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { NotificationStatus } from "src/notification/domain/notification-status.enum";
import { ReadAllNotificationsCommand } from "../ports/in/commands/read-all-notifications.command";
import { ReadAllNotificationsUseCase } from "../ports/in/use-cases/read-all-notifications.use-case";
import { NotificationRepository, NotificationRepositoryProvider } from "../ports/out/notification.repository";

@Injectable()
export class ReadAllNotificationsService implements ReadAllNotificationsUseCase {
    public constructor(
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUserUseCase: GetAuthenticatedUserUseCase,
        @Inject(NotificationRepositoryProvider)
        protected notificationRepository: NotificationRepository,
    ) {}

    public async execute(command: ReadAllNotificationsCommand): Promise<void> {
        const user = await this.getAuthenticatedUserUseCase.execute(null);

        const notifications = await this.notificationRepository.findBy({
            userId: user.id(),
            status: NotificationStatus.UNREAD,
        });

        notifications.forEach(async (n) => {
            n.markAsRead();

            await this.notificationRepository.update(n);
        });
    }
}