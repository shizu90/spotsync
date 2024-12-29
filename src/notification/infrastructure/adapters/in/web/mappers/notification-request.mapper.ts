import { ListNotificationsCommand } from "src/notification/application/ports/in/commands/list-notifications.command";
import { ReadAllNotificationsCommand } from "src/notification/application/ports/in/commands/read-all-notifications.command";
import { ReadNotificationCommand } from "src/notification/application/ports/in/commands/read-notification.command";
import { ListNotificationsQueryRequest } from "../requests/list-notifications-query.request";

export class NotificationRequestMapper {
    public static listNotificationsCommand(query: ListNotificationsQueryRequest): ListNotificationsCommand {
        return new ListNotificationsCommand(
            query.status,
            query.type,
            query.sort,
            query.sort_direction,
            query.page,
            query.limit,
            query.paginate,
        );
    }

    public static readNotificationCommand(id: string): ReadNotificationCommand {
        return new ReadNotificationCommand(id);
    }

    public static readAllNotificationsCommand(): ReadAllNotificationsCommand {
        return new ReadAllNotificationsCommand();
    }
}