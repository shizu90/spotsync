import { Command } from "src/common/common.command";

export class GetUserCommand extends Command 
{
    constructor(
        readonly id: string
    ) 
    {super();}
}