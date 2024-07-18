import { Command } from "src/common/common.command";
import { SortDirection } from "src/common/enums/sort-direction.enum";

export class ListGroupRequestsCommand extends Command 
{
    constructor(
        readonly groupId: string,
        readonly name?: string,
        readonly sort?: string,
        readonly sortDirection?: SortDirection,
        readonly paginate?: boolean,
        readonly page?: number,
        readonly limit?: number
    ) 
    {super();}
}