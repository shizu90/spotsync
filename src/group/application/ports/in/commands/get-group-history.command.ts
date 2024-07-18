import { Command } from "src/common/common.command";
import { SortDirection } from "src/common/enums/sort-direction.enum";

export class GetGroupHistoryCommand extends Command 
{
    constructor(
        readonly groupId: string,
        readonly sort?: string,
        readonly sortDirection?: SortDirection,
        readonly paginate?: boolean,
        readonly page?: number,
        readonly limit?: number
    ) 
    {super();}
}