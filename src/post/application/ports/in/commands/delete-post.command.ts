import { Command } from "src/common/common.command";

export class DeletePostCommand extends Command 
{
    constructor(
        readonly id: string
    ) 
    {super();}
}