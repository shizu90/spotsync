import { Command } from "src/common/core/common.command";

export class GetGroupBannerPictureCommand extends Command {
    constructor(
        readonly id: string,
    ) {super();}
}