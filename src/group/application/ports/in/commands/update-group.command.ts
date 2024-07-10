import { Command } from "src/common/common.command";

export class UpdateGroupCommand extends Command 
{
    constructor(
        readonly id: string,
        readonly name?: string,
        readonly about?: string
    ) 
    {super();}
}