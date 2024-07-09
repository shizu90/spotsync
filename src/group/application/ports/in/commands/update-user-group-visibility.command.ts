import { Command } from "src/common/common.command";
import { UserGroupVisibility } from "src/group/domain/user-group-visibility.enum";

export class UpdateUserGroupVisibilityCommand extends Command 
{
    constructor(
        readonly userGroupId: string,
        readonly groupVisibility: UserGroupVisibility,
        readonly postVisibility: UserGroupVisibility,
        readonly eventVisibility: UserGroupVisibility
    ) 
    {super();}
}