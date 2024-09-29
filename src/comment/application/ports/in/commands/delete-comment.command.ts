import { Command } from "src/common/core/common.command";

export class DeleteCommentCommand extends Command {
    constructor(
        readonly id: string,
    ) 
    {super();}
}