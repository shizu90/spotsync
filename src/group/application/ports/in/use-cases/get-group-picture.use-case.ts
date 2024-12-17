import { ReadStream } from "fs";
import { UseCase } from "src/common/core/common.use-case";
import { GetGroupPictureCommand } from "../commands/get-group-picture.command";

export const GetGroupPictureUseCaseProvider = "GetGroupPictureUseCase";

export interface GetGroupPictureUseCase extends UseCase<GetGroupPictureCommand, Promise<ReadStream>> {}