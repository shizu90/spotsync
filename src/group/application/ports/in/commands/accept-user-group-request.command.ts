import { Command } from "src/common/common.command";

export class AcceptUserGroupRequestCommand extends Command 
{
    constructor(
        readonly userGroupId,
        readonly userGroupRequestId
    ) 
    {super();}
}