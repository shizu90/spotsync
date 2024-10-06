import { Command } from "src/common/core/common.command";
import { SortDirection } from "src/common/enums/sort-direction.enum";
import { NotificationStatus } from "src/notification/domain/notification-status.enum";
import { NotificationType } from "src/notification/domain/notification-type.enum";

export class ListNotificationsCommand extends Command {
    constructor(
        readonly status?: NotificationStatus,
        readonly type?: NotificationType,
        readonly sort?: string,
        readonly sortDirection?: SortDirection,
        readonly page?: number,
        readonly limit?: number,
        readonly paginate?: boolean,
    ) {super();}
}