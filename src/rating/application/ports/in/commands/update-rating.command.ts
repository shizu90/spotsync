import { Command } from "src/common/core/common.command";

export class UpdateRatingCommand extends Command {
    constructor(
        readonly id: string,
        readonly value?: number,
        readonly comment?: string,
    ) {super();}
}