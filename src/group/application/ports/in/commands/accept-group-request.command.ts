import { Command } from "src/common/common.command";

export class AcceptGroupRequestCommand extends Command 
{
    constructor(
        readonly id,
        readonly groupRequestId
    ) 
    {super();}
}