import { Command } from "src/common/core/common.command";

export class GetRatingCommand extends Command {
    constructor(
        readonly id: string,
    ) {super();}
}