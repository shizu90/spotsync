import { ReadStream } from "fs";
import { UseCase } from "src/common/core/common.use-case";
import { GetUserProfilePictureCommand } from "../commands/get-user-profile-picture.command";

export const GetUserProfilePictureUseCaseProvider = "GetUserProfilePicture";

export interface GetUserProfilePictureUseCase extends UseCase<GetUserProfilePictureCommand, Promise<ReadStream>> {}