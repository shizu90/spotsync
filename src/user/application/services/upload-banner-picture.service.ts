import { Injectable } from "@nestjs/common";
import { UploadBannerPictureCommand } from "../ports/in/upload-banner-picture.command";
import { UploadBannerPictureUseCase } from "../ports/in/upload-banner-picture.use-case";
import { UserRepository } from "../ports/out/user.repository";

@Injectable()
export class UploadBannerPictureService implements UploadBannerPictureUseCase 
{
    constructor(
        protected userRepository: UserRepository
    ) 
    {}

    public async execute(command: UploadBannerPictureCommand): Promise<string> 
    {
        return '';
    }
}