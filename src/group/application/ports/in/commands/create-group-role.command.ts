import { Command } from "src/common/common.command";

export class CreateGroupRoleCommand extends Command 
{
    constructor(
        readonly groupId: string,
        readonly name: string,
        readonly hexColor: string,
        readonly permissionIds: string[]
    )
    {super();}
}