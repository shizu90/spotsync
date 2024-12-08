import { ReadStream } from "fs";
import { UseCase } from "src/common/core/common.use-case";
import { GetAttachmentCommand } from "../commands/get-attachment.command";

export const GetAttachmentUseCaseProvider = "GetAttachmentUseCase";

export interface GetAttachmentUseCase extends UseCase<GetAttachmentCommand, Promise<ReadStream>> {}