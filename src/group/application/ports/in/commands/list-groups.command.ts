import { Command } from "src/common/common.command";

export class ListGroupsCommand extends Command 
{
    constructor(
        readonly name?: string,
        readonly groupVisibility?: string,
        readonly sort?: string,
        readonly page?: number,
        readonly paginate?: boolean,
        readonly limit?: number
    ) 
    {super();}
}