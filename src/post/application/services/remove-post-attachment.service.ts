import { Inject, Injectable } from '@nestjs/common';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import {
	LikeRepository,
	LikeRepositoryProvider,
} from 'src/like/application/ports/out/like.repository';
import { LikableSubject } from 'src/like/domain/likable-subject.enum';
import { RemovePostAttachmentCommand } from '../ports/in/commands/remove-post-attachment.command';
import { RemovePostAttachmentUseCase } from '../ports/in/use-cases/remove-post-attachment.use-case';
import { PostDto } from '../ports/out/dto/post.dto';
import {
	PostRepository,
	PostRepositoryProvider,
} from '../ports/out/post.repository';
import { PostNotFoundError } from './errors/post-not-found.error';

@Injectable()
export class RemovePostAttachmentService
	implements RemovePostAttachmentUseCase
{
	constructor(
		@Inject(PostRepositoryProvider)
		protected postRepository: PostRepository,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
		@Inject(LikeRepositoryProvider)
		protected likeRepository: LikeRepository,
	) {}

	public async execute(
		command: RemovePostAttachmentCommand,
	): Promise<PostDto> {
		const authenticatedUser = await this.getAuthenticatedUser.execute(null);

		const post = await this.postRepository.findById(command.postId);

		if (post === undefined || post === null) {
			throw new PostNotFoundError();
		}

		if (post.creator().id() !== authenticatedUser.id()) {
			throw new UnauthorizedAccessError();
		}

		post.removeAttachment(command.id);

		await this.postRepository.update(post);

		const liked =
			(
				await this.likeRepository.findBy({
					subjectId: post.id(),
					userId: authenticatedUser.id(),
					subjectType: LikableSubject.POST,
				})
			).length > 0;

		const totalLikes = await this.likeRepository.countBy({
			subjectId: post.id(),
			subjectType: LikableSubject.POST,
		});

		return PostDto.fromModel(post)
			.setLiked(liked);
	}
}
