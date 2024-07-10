import { Command } from "src/common/common.command";

export class CreateGroupCommand extends Command 
{
    constructor(
        readonly name: string,
        readonly about: string
    ) 
    {super();}
}