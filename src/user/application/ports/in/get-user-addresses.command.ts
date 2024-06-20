import { Command } from "src/common/common.command";

export class GetUserAddressesCommand extends Command 
{
    constructor(
        readonly userId: string
    ) 
    {super();}
}