import { Pagination } from "src/common/core/common.repository";
import { UseCase } from "src/common/core/common.use-case";
import { CommentDto } from "../../out/dto/comment.dto";
import { ListCommentsCommand } from "../commands/list-comments.command";

export const ListCommentsUseCaseProvider = "ListCommentsUseCase";

export interface ListCommentsUseCase extends UseCase<ListCommentsCommand, Promise<Pagination<CommentDto> | Array<CommentDto>>> {}