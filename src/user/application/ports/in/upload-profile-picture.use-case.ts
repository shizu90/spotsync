import { UseCase } from "src/common/common.use-case";
import { UploadProfilePictureCommand } from "./upload-profile-picture.command";

export interface UploadProfilePictureUseCase extends UseCase<UploadProfilePictureCommand, Promise<string>> 
{}