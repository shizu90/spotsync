import { Command } from "src/common/common.command";

export class SignOutCommand extends Command 
{
    constructor(
        readonly userId: string
    ) 
    {super();}
}