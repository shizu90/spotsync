import { Inject, Injectable } from "@nestjs/common";
import { UploadBannerPictureCommand } from "../ports/in/commands/upload-banner-picture.command";
import { UploadBannerPictureUseCase } from "../ports/in/use-cases/upload-banner-picture.use-case";
import { UserRepository, UserRepositoryProvider } from "../ports/out/user.repository";

@Injectable()
export class UploadBannerPictureService implements UploadBannerPictureUseCase 
{
    constructor(
        @Inject(UserRepositoryProvider) 
        protected userRepository: UserRepository
    ) 
    {}

    public async execute(command: UploadBannerPictureCommand): Promise<string> 
    {
        return '';
    }
}