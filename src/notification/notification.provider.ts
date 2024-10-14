import { Provider } from "@nestjs/common";
import { CreateNotificationUseCaseProvider } from "./application/ports/in/use-cases/create-notification.use-case";
import { ListNotificationsUseCaseProvider } from "./application/ports/in/use-cases/list-notifications.use-case";
import { NotificationRepositoryProvider } from "./application/ports/out/notification.repository";
import { CreateNotificationService } from "./application/services/create-notification.service";
import { ListNotificationsService } from "./application/services/list-notifications.service";
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
        useClass: NotificationGateway,
        provide: NotificationGateway,
    }
];