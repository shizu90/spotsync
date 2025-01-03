import { Inject, Injectable } from "@nestjs/common";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { NotificationStatus } from "src/notification/domain/notification-status.enum";
import { GetTotalUnreadNotificationsCommand } from "../ports/in/commands/get-total-unread-notifications.command";
import { GetTotalUnreadNotificationsUseCase } from "../ports/in/use-cases/get-total-unread-notifications.use-case";
import { NotificationRepository, NotificationRepositoryProvider } from "../ports/out/notification.repository";

@Injectable()
export class GetTotalUnreadNotificationsService implements GetTotalUnreadNotificationsUseCase {
    public constructor(
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUserUseCase: GetAuthenticatedUserUseCase,
        @Inject(NotificationRepositoryProvider)
        protected notificationRepository: NotificationRepository
    ) {}

    public async execute(command: GetTotalUnreadNotificationsCommand): Promise<number> {
        const user = await this.getAuthenticatedUserUseCase.execute(null);

        const total = await this.notificationRepository.countBy({
            status: NotificationStatus.UNREAD,
            userId: user.id(),
        });

        return total;
    }
}