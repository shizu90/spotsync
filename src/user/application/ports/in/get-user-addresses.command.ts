import { Command } from "src/common/common.command";

export class GetUserAddressessCommand extends Command 
{
    constructor(
        readonly userId: string
    ) 
    {super();}
}