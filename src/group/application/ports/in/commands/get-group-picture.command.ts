import { Command } from "src/common/core/common.command";

export class GetGroupPictureCommand extends Command {
    constructor(
        readonly id: string,
    ) {super();}
}