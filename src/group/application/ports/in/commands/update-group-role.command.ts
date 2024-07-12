import { Command } from "src/common/common.command";

export class UpdateGroupRoleCommand extends Command 
{
    constructor(
        readonly id: string,
        readonly groupId: string,
        readonly name?: string,
        readonly hexColor?: string,
        readonly permissionIds?: string[]
    ) 
    {super();}
}