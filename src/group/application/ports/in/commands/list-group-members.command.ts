import { Command } from "src/common/common.command";

export class ListGroupMembersCommand extends Command 
{
    constructor(
        readonly groupId: string,
        readonly name?: string,
        readonly roleId?: string,
        readonly sort?: string,
        readonly sortDirection?: string,
        readonly page?: number,
        readonly paginate?: boolean,
        readonly limit?: number
    ) 
    {super();}
}