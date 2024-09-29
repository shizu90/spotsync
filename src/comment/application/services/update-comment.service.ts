import { Inject, Injectable } from "@nestjs/common";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-access.error";
import { UpdateCommentCommand } from "../ports/in/commands/update-comment.command";
import { UpdateCommentUseCase } from "../ports/in/use-cases/update-comment.use-case";
import { CommentRepository, CommentRepositoryProvider } from "../ports/out/comment.repository";
import { CommentNotFoundError } from "./errors/comment-not-found.error";

@Injectable()
export class UpdateCommentService implements UpdateCommentUseCase {
    constructor(
        @Inject(CommentRepositoryProvider)
        protected commentRepository: CommentRepository,
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase
    ) {}

    public async execute(command: UpdateCommentCommand): Promise<void> {
        const authenticatedUser = await this.getAuthenticatedUser.execute(null);

        const comment = await this.commentRepository.findById(command.id);

        if (comment === null || comment === undefined) {
            throw new CommentNotFoundError();
        }

        if (comment.user().id() !== authenticatedUser.id()) {
            throw new UnauthorizedAccessError();
        }

        comment.changeText(command.text);

        await this.commentRepository.update(comment);
    }
}