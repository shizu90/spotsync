import { Command } from "src/common/common.command";

export class ListGroupRolesCommand extends Command 
{
    constructor(
        readonly groupId: string,
        readonly name?: string,
        readonly isImmutable?: boolean,
        readonly sort?: string,
        readonly sortDirection?: string,
        readonly page?: number,
        readonly paginate?: boolean,
        readonly limit?: number
    ) 
    {super();}
}