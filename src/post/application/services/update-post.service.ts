import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { PostAttachment } from 'src/post/domain/post-attachment.model';
import { FileStorage, FileStorageProvider } from 'src/storage/file-storage';
import { UpdatePostCommand } from '../ports/in/commands/update-post.command';
import { UpdatePostUseCase } from '../ports/in/use-cases/update-post.use-case';
import {
	PostRepository,
	PostRepositoryProvider,
} from '../ports/out/post.repository';
import { PostNotFoundError } from './errors/post-not-found.error';

@Injectable()
export class UpdatePostService implements UpdatePostUseCase {
	constructor(
		@Inject(PostRepositoryProvider)
		protected postRepository: PostRepository,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
		@Inject(FileStorageProvider)
		protected fileStorage: FileStorage,
	) {}

	public async execute(command: UpdatePostCommand): Promise<void> {
		const authenticatedUser = await this.getAuthenticatedUser.execute(null);

		const post = await this.postRepository.findById(command.id);

		if (post === null || post === undefined) {
			throw new PostNotFoundError();
		}

		if (post.creator().id() !== authenticatedUser.id()) {
			throw new UnauthorizedAccessError();
		}

		if (command.title && command.title.length > 0) {
			post.changeTitle(command.title);
		}

		if (command.content && command.content.length > 0) {
			post.changeContent(command.content);
		}

		if (command.visibility) {
			post.changeVisibility(command.visibility);
		}

		for (const attachment of post.attachments()) {
			await this.fileStorage.delete(attachment.filePath());

			post.removeAttachment(attachment.id());
		}

		if (command.attachments) {
			command.attachments.forEach(async (attachment) => {
				const savedFile = await this.fileStorage.save(
					`posts/${post.id()}/attachments`,
					attachment
				);
	
				post.addAttachment(PostAttachment.create(
					randomUUID(),
					savedFile.path,
					savedFile.content,
					attachment.mimetype,
				));
			});
		}

		this.postRepository.update(post);
	}
}
