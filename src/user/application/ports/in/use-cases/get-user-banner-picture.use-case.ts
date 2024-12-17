import { ReadStream } from "fs";
import { UseCase } from "src/common/core/common.use-case";
import { GetUserBannerPictureCommand } from "../commands/get-user-banner-picture.command";

export const GetUserBannerPictureUseCaseProvider = "GetUserBannerPictureUseCase";

export interface GetUserBannerPictureUseCase extends UseCase<GetUserBannerPictureCommand, Promise<ReadStream>> {}