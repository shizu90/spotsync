import { Command } from "src/common/common.command";

export class DeleteUserGroupCommand extends Command 
{
    constructor(
        readonly userGroupId: string
    ) 
    {super();}
}