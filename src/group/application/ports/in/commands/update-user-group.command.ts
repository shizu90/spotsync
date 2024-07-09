import { Command } from "src/common/common.command";

export class UpdateUserGroupCommand extends Command 
{
    constructor(
        readonly userGroupId: string,
        readonly name?: string,
        readonly about?: string
    ) 
    {super();}
}