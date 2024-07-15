import { Command } from "src/common/common.command";

export class ListUserAddressesCommand extends Command 
{
    constructor(
        readonly userId: string,
        readonly name?: string,
        readonly main?: boolean,
        readonly sort?: string,
        readonly sortDirection?: string,
        readonly paginate?: boolean,
        readonly page?: number,
        readonly limit?: number
    ) 
    {super();}
}