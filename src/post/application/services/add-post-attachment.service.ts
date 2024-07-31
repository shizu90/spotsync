import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { PostAttachment } from 'src/post/domain/post-attachment.model';
import { AddPostAttachmentCommand } from '../ports/in/commands/add-post-attachment.command';
import { AddPostAttachmentUseCase } from '../ports/in/use-cases/add-post-attachment.use-case';
import { AddPostAttachmentDto } from '../ports/out/dto/add-post-attachment.dto';
import {
	PostRepository,
	PostRepositoryProvider,
} from '../ports/out/post.repository';
import { PostNotFoundError } from './errors/post-not-found.error';

@Injectable()
export class AddPostAttachmentService implements AddPostAttachmentUseCase {
	constructor(
		@Inject(PostRepositoryProvider)
		protected postRepository: PostRepository,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
	) {}

	public async execute(
		command: AddPostAttachmentCommand,
	): Promise<AddPostAttachmentDto> {
		const authenticatedUser = await this.getAuthenticatedUser.execute(null);

		const post = await this.postRepository.findById(command.postId);

		if (post === undefined || post === null) {
			throw new PostNotFoundError(`Post not found`);
		}

		if (post.creator().id() !== authenticatedUser.id()) {
			throw new UnauthorizedAccessError(`Unauthorized access`);
		}

		const attachment = PostAttachment.create(randomUUID(), '', '');

		post.addAttachment(attachment);

		await this.postRepository.update(post);

		return new AddPostAttachmentDto(
			attachment.id(),
			post.id(),
			attachment.filePath(),
			attachment.fileType(),
		);
	}
}