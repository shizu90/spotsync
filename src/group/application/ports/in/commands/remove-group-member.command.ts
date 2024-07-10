import { Command } from "src/common/common.command";

export class RemoveGroupMemberCommand extends Command 
{
    constructor(
        readonly id: string,
        readonly userId: string
    ) 
    {super();}
}