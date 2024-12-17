import { Command } from "src/common/core/common.command";

export class GetUserBannerPictureCommand extends Command {
    constructor(
        readonly id: string,
    ) {super();}
}