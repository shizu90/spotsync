import { Inject, Injectable } from '@nestjs/common';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { CommentRepository, CommentRepositoryProvider } from 'src/comment/application/ports/out/comment.repository';
import { Comment } from 'src/comment/domain/comment.model';
import { PostRepository, PostRepositoryProvider } from 'src/post/application/ports/out/post.repository';
import { Post } from 'src/post/domain/post.model';
import { UnlikeCommand } from '../ports/in/commands/unlike.command';
import { UnlikeUseCase } from '../ports/in/use-cases/unlike.use-case';
import {
	LikeRepository,
	LikeRepositoryProvider,
} from '../ports/out/like.repository';
import { LikeNotFoundError } from './errors/like-not-found.error';

@Injectable()
export class UnlikeService implements UnlikeUseCase {
	constructor(
		@Inject(LikeRepositoryProvider)
		protected likeRepository: LikeRepository,
		@Inject(PostRepositoryProvider)
		protected postRepository: PostRepository,
		@Inject(CommentRepositoryProvider)
		protected commentRepository: CommentRepository,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
	) {}

	public async execute(command: UnlikeCommand): Promise<void> {
		const authenticatedUser = await this.getAuthenticatedUser.execute(null);

		const like = (
			await this.likeRepository.findBy({
				subject: command.subject,
				subjectId: command.subjectId,
				userId: authenticatedUser.id(),
			})
		).at(0);

		if (like === null || like === undefined) {
			throw new LikeNotFoundError(`Like not found`);
		}

		if (like.user().id() !== authenticatedUser.id()) {
			throw new UnauthorizedAccessError();
		}

		const likable = like.likable();
		likable.unlike();

		if (likable instanceof Post) {
			await this.postRepository.update(likable);
		} else if (likable instanceof Comment) {
			await this.commentRepository.update(likable);
		}

		await this.likeRepository.delete(like.id());
	}
}
