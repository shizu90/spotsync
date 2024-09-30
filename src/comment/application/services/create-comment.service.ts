import { Inject, Injectable } from '@nestjs/common';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { CommentableSubject } from 'src/comment/domain/comment-subject.model.';
import { Commentable } from 'src/comment/domain/commentable.interface';
import {
	SpotRepository,
	SpotRepositoryProvider,
} from 'src/spot/application/ports/out/spot.repository';
import { CreateCommentCommand } from '../ports/in/commands/create-comment.command';
import { CreateCommentUseCase } from '../ports/in/use-cases/create-comment.use-case';
import {
	CommentRepository,
	CommentRepositoryProvider,
} from '../ports/out/comment.repository';
import { CommentDto } from '../ports/out/dto/comment.dto';
import { CommentableNotFoundError } from './errors/commentable-not-found.error';

@Injectable()
export class CreateCommentService implements CreateCommentUseCase {
	constructor(
		@Inject(SpotRepositoryProvider)
		protected spotRepository: SpotRepository,
		@Inject(CommentRepositoryProvider)
		protected commentRepository: CommentRepository,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
	) {}

	public async execute(command: CreateCommentCommand): Promise<CommentDto> {
		const authenticatedUser = await this.getAuthenticatedUser.execute(null);

		let commentable: Commentable = null;

		switch (command.subject) {
			case CommentableSubject.SPOT:
				commentable = await this.spotRepository.findById(
					command.subjectId,
				);
				break;
			default:
				break;
		}

		if (commentable === null || commentable === undefined) {
			throw new CommentableNotFoundError();
		}

		const comment = commentable.comment(authenticatedUser, command.text);

		await this.commentRepository.store(comment);

		return CommentDto.fromModel(comment);
	}
}
