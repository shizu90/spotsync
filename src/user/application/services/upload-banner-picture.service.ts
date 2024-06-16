import { UploadBannerPictureCommand } from "../ports/in/upload-banner-picture.command";
import { UploadBannerPictureUseCase } from "../ports/in/upload-banner-picture.use-case";
import { UserRepository } from "../ports/out/user.repository";

export class UploadBannerPictureService extends UploadBannerPictureUseCase 
{
    constructor(
        protected userRepository: UserRepository
    ) 
    {super();}

    public async execute(command: UploadBannerPictureCommand): Promise<string> 
    {
        return '';
    }
}