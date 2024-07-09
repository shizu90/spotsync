import { Command } from "src/common/common.command";

export class JoinUserGroupCommand extends Command 
{
    constructor(
        readonly userGroupId
    ) 
    {super();}
}