import { UseCase } from "src/common/core/common.use-case";
import { CommentDto } from "../../out/dto/comment.dto";
import { CreateCommentCommand } from "../commands/create-comment.command";

export const CreateCommentUseCaseProvider = "CreateCommentUseCase";

export interface CreateCommentUseCase extends UseCase<CreateCommentCommand, Promise<CommentDto>> {}