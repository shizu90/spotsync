import { UseCase } from "src/common/common.use-case";
import { UploadBannerPictureCommand } from "./upload-banner-picture.command";

export interface UploadBannerPictureUseCase extends UseCase<UploadBannerPictureCommand, Promise<string>> 
{}