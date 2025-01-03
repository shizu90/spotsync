import { Provider } from "@nestjs/common";
import { CreateNotificationUseCaseProvider } from "./application/ports/in/use-cases/create-notification.use-case";
import { GetTotalUnreadNotificationsUseCaseProvider } from "./application/ports/in/use-cases/get-total-unread-notifications.use-case";
import { ListNotificationsUseCaseProvider } from "./application/ports/in/use-cases/list-notifications.use-case";
import { ReadAllNotificationsUseCaseProvider } from "./application/ports/in/use-cases/read-all-notifications.use-case";
import { ReadNotificationUseCaseProvider } from "./application/ports/in/use-cases/read-notification.use-case";
import { NotificationRepositoryProvider } from "./application/ports/out/notification.repository";
import { CreateNotificationService } from "./application/services/create-notification.service";
import { GetTotalUnreadNotificationsService } from "./application/services/get-total-unread-notifications.service";
import { ListNotificationsService } from "./application/services/list-notifications.service";
import { ReadAllNotificationsService } from "./application/services/read-all-notifications.service";
import { ReadNotificationService } from "./application/services/read-notification.service";
import { NotificationGateway } from "./infrastructure/adapters/in/web/handlers/notification.gateway";
import { NotificationRepositoryImpl } from "./infrastructure/adapters/out/notification.db";

export const Providers: Provider[] = [
    {
        provide: CreateNotificationUseCaseProvider,
        useClass: CreateNotificationService,
    },
    {
        provide: ListNotificationsUseCaseProvider,
        useClass: ListNotificationsService,
    },
    {
        provide: NotificationRepositoryProvider,
        useClass: NotificationRepositoryImpl,
    },
    {
        provide: ReadNotificationUseCaseProvider,
        useClass: ReadNotificationService,
    },
    {
        provide: ReadAllNotificationsUseCaseProvider,
        useClass: ReadAllNotificationsService,
    },
    {
        provide: GetTotalUnreadNotificationsUseCaseProvider,
        useClass: GetTotalUnreadNotificationsService,
    },
    {
        provide: NotificationGateway,
        useClass: NotificationGateway,
    }
];