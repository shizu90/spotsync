import { Command } from "src/common/core/common.command";

export class RemoveSpotCommand extends Command 
{
    constructor(
        readonly id: string,
        readonly spotId: string,
    ) 
    {super();}
}