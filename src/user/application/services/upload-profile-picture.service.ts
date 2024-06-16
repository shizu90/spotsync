import { UploadProfilePictureCommand } from "../ports/in/upload-profile-picture.command";
import { UploadProfilePictureUseCase } from "../ports/in/upload-profile-picture.use-case";
import { UserRepository } from "../ports/out/user.repository";

export class UploadProfilePictureService extends UploadProfilePictureUseCase 
{
    constructor(
        protected userRepository: UserRepository
    ) 
    {super();}

    public async execute(command: UploadProfilePictureCommand): Promise<string> 
    {
        return '';
    }
}