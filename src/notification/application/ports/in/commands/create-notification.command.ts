import { Command } from "src/common/core/common.command";
import { NotificationType } from "src/notification/domain/notification-type.enum";

export class CreateNotificationCommand extends Command {
    constructor(
        readonly title: string,
        readonly content: string,
        readonly type: NotificationType,
        readonly userId: string,
    ) {super();}
}