import { Command } from "src/common/common.command";

export class UpdateUserProfileCommand extends Command 
{
    constructor(
        readonly id: string,
        readonly profilePicture: string,
        readonly bannerPicture: string,
        readonly biograph: string,
        readonly birthDate: Date
    ) 
    {super();}
}