import { Command } from "src/common/common.command";

export class LeaveUserGroupCommand extends Command 
{
    constructor(
        readonly userGroupId
    ) 
    {super();}
}