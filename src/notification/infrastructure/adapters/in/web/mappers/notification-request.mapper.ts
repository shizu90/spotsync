import { ListNotificationsCommand } from "src/notification/application/ports/in/commands/list-notifications.command";
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
}