import { Injectable } from "@nestjs/common";
import { UploadProfilePictureCommand } from "../ports/in/upload-profile-picture.command";
import { UploadProfilePictureUseCase } from "../ports/in/upload-profile-picture.use-case";
import { UserRepository } from "../ports/out/user.repository";

@Injectable()
export class UploadProfilePictureService implements UploadProfilePictureUseCase 
{
    constructor(
        protected userRepository: UserRepository
    ) 
    {}

    public async execute(command: UploadProfilePictureCommand): Promise<string> 
    {
        return '';
    }
}