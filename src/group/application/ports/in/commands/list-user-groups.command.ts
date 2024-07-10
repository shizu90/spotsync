import { Command } from "src/common/common.command";

export class ListUserGroupsCommand extends Command 
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