import { Inject, Injectable } from '@nestjs/common';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { DeleteCommentCommand } from '../ports/in/commands/delete-comment.command';
import { DeleteCommentUseCase } from '../ports/in/use-cases/delete-comment.use-case';
import {
	CommentRepository,
	CommentRepositoryProvider,
} from '../ports/out/comment.repository';
import { CommentNotFoundError } from './errors/comment-not-found.error';

@Injectable()
export class DeleteCommentService implements DeleteCommentUseCase {
	constructor(
		@Inject(CommentRepositoryProvider)
		protected commentRepository: CommentRepository,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
	) {}

	public async execute(command: DeleteCommentCommand): Promise<void> {
		const authenticatedUser = await this.getAuthenticatedUser.execute(null);

		const comment = await this.commentRepository.findById(command.id);

		if (comment === null || comment === undefined) {
			throw new CommentNotFoundError();
		}

		if (comment.user().id() !== authenticatedUser.id()) {
			throw new UnauthorizedAccessError();
		}

		await this.commentRepository.delete(comment.id());
	}
}
