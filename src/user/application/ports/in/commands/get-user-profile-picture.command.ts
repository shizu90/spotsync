import { Command } from "src/common/core/common.command";

export class GetUserProfilePictureCommand extends Command {
    constructor(
        readonly id: string
    ) {super();}
}