import { Command } from "src/common/common.command";

export class RemoveUserGroupMemberCommand extends Command 
{
    constructor(
        readonly userGroupId: string,
        readonly userId: string
    ) 
    {super();}
}