import { Command } from "src/common/common.command";

export class RefuseUserGroupRequestCommand extends Command 
{
    constructor(
        readonly userGroupId: string,
        readonly userGroupRequestId: string
    ) 
    {super();}
}