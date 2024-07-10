import { Command } from "src/common/common.command";

export class GetUserGroupCommand extends Command 
{
    constructor(
        readonly userGroupId: string
    ) 
    {super();}
}