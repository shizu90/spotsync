import { Command } from "src/common/common.command";

export class RefuseGroupRequestCommand extends Command 
{
    constructor(
        readonly id: string,
        readonly groupRequestId: string
    ) 
    {super();}
}