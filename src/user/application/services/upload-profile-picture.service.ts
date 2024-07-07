import { Inject, Injectable } from "@nestjs/common";
import { UploadProfilePictureCommand } from "../ports/in/commands/upload-profile-picture.command";
import { UploadProfilePictureUseCase } from "../ports/in/use-cases/upload-profile-picture.use-case";
import { UserRepository, UserRepositoryProvider } from "../ports/out/user.repository";

@Injectable()
export class UploadProfilePictureService implements UploadProfilePictureUseCase 
{
    constructor(
        @Inject(UserRepositoryProvider) 
        protected userRepository: UserRepository
    ) 
    {}

    public async execute(command: UploadProfilePictureCommand): Promise<string> 
    {
        return '';
    }
}