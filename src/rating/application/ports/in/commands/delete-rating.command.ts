import { Command } from "src/common/core/common.command";

export class DeleteRatingCommand extends Command {
    constructor(
        readonly id: string,
    ) {super();}
}