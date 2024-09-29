import { Command } from "src/common/core/common.command";

export class UpdateCommentCommand extends Command {
    public constructor(
        readonly id: string,
        readonly text: string,
    ) 
    {super();}
}