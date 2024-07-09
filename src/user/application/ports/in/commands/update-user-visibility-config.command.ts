import { Command } from "src/common/common.command";
import { UserVisibility } from "src/user/domain/user-visibility.enum";

export class UpdateUserVisibilityConfigCommand extends Command 
{
    constructor(
        readonly userId: string,
        readonly profileVisibility: UserVisibility,
        readonly poiFolderVisibility: UserVisibility,
        readonly visitedPoiVisibility: UserVisibility,
        readonly addressVisibility: UserVisibility,
        readonly postVisibility: UserVisibility,
    ) 
    {super();}
}