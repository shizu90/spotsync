import { Command } from "src/common/core/common.command";

export class ReadNotificationCommand extends Command {
    constructor(
        readonly id: string
    ) {super();}
}