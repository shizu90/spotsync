import { Command } from "src/common/core/common.command";

export class RemoveSpotCommand extends Command 
{
    constructor(
        readonly id: string,
        readonly spotIds: string[],
    ) 
    {super();}
}