import { Command } from "src/common/common.command";

export class UnfollowCommand extends Command 
{
    constructor(
        readonly fromUserId: string,
        readonly toUserId: string
    ) 
    {super();}
}