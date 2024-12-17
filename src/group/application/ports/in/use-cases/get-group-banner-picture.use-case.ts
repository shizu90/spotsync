import { ReadStream } from "fs";
import { UseCase } from "src/common/core/common.use-case";
import { GetGroupBannerPictureCommand } from "../commands/get-group-banner-picture.command";

export const GetGroupBannerPictureUseCaseProvider = "GetGroupBannerPictureUseCase";

export interface GetGroupBannerPictureUseCase extends UseCase<GetGroupBannerPictureCommand, Promise<ReadStream>> {}