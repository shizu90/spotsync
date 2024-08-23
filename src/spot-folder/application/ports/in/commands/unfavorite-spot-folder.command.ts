import { Command } from "src/common/core/common.command";

export class UnfavoriteSpotFolderCommand extends Command 
{
    constructor(
        readonly id: string,
    ) 
    {super();}
}