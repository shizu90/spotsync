import { UseCase } from "src/common/core/common.use-case";
import { UpdateCommentCommand } from "../commands/update-comment.command";

export const UpdateCommentUseCaseProvider = "UpdateCommentUseCase";

export interface UpdateCommentUseCase extends UseCase<UpdateCommentCommand, Promise<void>> {}