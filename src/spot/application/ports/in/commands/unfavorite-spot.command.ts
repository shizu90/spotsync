import { Command } from "src/common/core/common.command";

export class UnfavoriteSpotCommand extends Command 
{
    constructor(
        readonly id: string
    ) 
    {super();}
}