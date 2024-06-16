import { UseCase } from "src/common/common.use-case";
import { UploadBannerPictureCommand } from "./upload-banner-picture.command";

export abstract class UploadBannerPictureUseCase implements UseCase<UploadBannerPictureCommand, Promise<string>> 
{
    abstract execute(command: UploadBannerPictureCommand): Promise<string>;
}