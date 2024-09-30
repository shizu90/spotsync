import { Provider } from "@nestjs/common";
import { CreateCommentUseCaseProvider } from "./application/ports/in/use-cases/create-comment.use-case";
import { DeleteCommentUseCaseProvider } from "./application/ports/in/use-cases/delete-comment.use-case";
import { ListCommentsUseCaseProvider } from "./application/ports/in/use-cases/list-comments.use-case";
import { UpdateCommentUseCaseProvider } from "./application/ports/in/use-cases/update-comment.use-case";
import { CommentRepositoryProvider } from "./application/ports/out/comment.repository";
import { CreateCommentService } from "./application/services/create-comment.service";
import { DeleteCommentService } from "./application/services/delete-comment.service";
import { ListCommentsService } from "./application/services/list-comments.service";
import { UpdateCommentService } from "./application/services/update-comment.service";
import { CommentRepositoryImpl } from "./infrastructure/adapters/out/comment.db";

export const Providers: Provider[] = [
    {
        provide: CreateCommentUseCaseProvider,
        useClass: CreateCommentService,
    },
    {
        provide: UpdateCommentUseCaseProvider,
        useClass: UpdateCommentService,
    },
    {
        provide: DeleteCommentUseCaseProvider,
        useClass: DeleteCommentService,
    },
    {
        provide: ListCommentsUseCaseProvider,
        useClass: ListCommentsService,
    },
    {
        provide: CommentRepositoryProvider,
        useClass: CommentRepositoryImpl,
    }
];