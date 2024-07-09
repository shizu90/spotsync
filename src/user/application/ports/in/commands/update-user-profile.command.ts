import { Command } from "src/common/common.command";
import { ProfileVisibility } from "src/user/domain/profile-visibility.enum";

export class UpdateUserProfileCommand extends Command 
{
    constructor(
        readonly id: string,
        readonly profilePicture: string,
        readonly bannerPicture: string,
        readonly biograph: string,
        readonly birthDate: Date,
        readonly profileVisibility: ProfileVisibility
    ) 
    {super();}
}