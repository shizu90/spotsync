import { Command } from "src/common/common.command";

export class ListUsersCommand extends Command 
{
    constructor(
        readonly name?: string,
        readonly sort?: string,
        readonly sortDirection?: 'asc' | 'desc',
        readonly page?: number,
        readonly paginate?: boolean,
        readonly limit?: number
    ) 
    {super();}
}