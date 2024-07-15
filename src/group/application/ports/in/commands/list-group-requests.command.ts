import { Command } from "src/common/common.command";

export class ListGroupRequestsCommand extends Command 
{
    constructor(
        readonly groupId: string,
        readonly name?: string,
        readonly sort?: string,
        readonly sortDirection?: string,
        readonly paginate?: boolean,
        readonly page?: number,
        readonly limit?: number
    ) 
    {super();}
}