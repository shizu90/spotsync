import { Command } from "src/common/core/common.command";

export class GetSpotEventCommand extends Command {
    constructor(
        readonly id: string,
    ) {super();}
}