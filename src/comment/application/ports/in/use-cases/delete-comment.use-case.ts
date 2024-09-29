import { UseCase } from "src/common/core/common.use-case";
import { DeleteCommentCommand } from "../commands/delete-comment.command";

export const DeleteCommentUseCaseProvider = "DeleteCommentUseCase";

export interface DeleteCommentUseCase extends UseCase<DeleteCommentCommand, Promise<void>> {}