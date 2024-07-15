import { Command } from "src/common/common.command";

export class GetGroupRoleCommand extends Command 
{
    constructor(
        readonly id: string,
        readonly groupId: string
    ) 
    {super();}
}