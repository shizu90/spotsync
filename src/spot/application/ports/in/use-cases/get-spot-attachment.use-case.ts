import { ReadStream } from "fs";
import { UseCase } from "src/common/core/common.use-case";
import { GetSpotAttachmentCommand } from "../commands/get-spot-attachment.command";

export const GetSpotAttachmentUseCaseProvider = "GetSpotAttachmentUseCase";

export interface GetSpotAttachmentUseCase extends UseCase<GetSpotAttachmentCommand, Promise<ReadStream>> {}