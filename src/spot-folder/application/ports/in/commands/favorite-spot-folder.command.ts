import { Command } from "src/common/core/common.command";

export class FavoriteSpotFolderCommand extends Command 
{
    constructor(
        readonly id: string,
    ) 
    {super();}
}