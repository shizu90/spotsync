import { UseCase } from "src/common/common.use-case";
import { UploadProfilePictureCommand } from "./upload-profile-picture.command";

export abstract class UploadProfilePictureUseCase implements UseCase<UploadProfilePictureCommand, Promise<string>> 
{
    abstract execute(command: UploadProfilePictureCommand): Promise<string>;
}