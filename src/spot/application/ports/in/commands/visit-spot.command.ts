import { Command } from "src/common/core/common.command";

export class VisitSpotCommand extends Command 
{
    constructor(
        readonly id: string,
    ) 
    {super();}
}