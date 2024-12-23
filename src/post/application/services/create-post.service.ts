import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import {
	GroupRepository,
	GroupRepositoryProvider,
} from 'src/group/application/ports/out/group.repository';
import { GroupNotFoundError } from 'src/group/application/services/errors/group-not-found.error';
import { GroupVisibility } from 'src/group/domain/group-visibility.enum';
import { Group } from 'src/group/domain/group.model';
import { CreateNotificationCommand } from 'src/notification/application/ports/in/commands/create-notification.command';
import { CreateNotificationUseCase, CreateNotificationUseCaseProvider } from 'src/notification/application/ports/in/use-cases/create-notification.use-case';
import { NotificationType } from 'src/notification/domain/notification-type.enum';
import { NotificationPayload, NotificationPayloadSubject } from 'src/notification/domain/notification.model';
import { PostAttachment } from 'src/post/domain/post-attachment.model';
import { PostVisibility } from 'src/post/domain/post-visibility.enum';
import { Post } from 'src/post/domain/post.model';
import { FileStorage, FileStorageProvider } from 'src/storage/file-storage';
import { UserVisibility } from 'src/user/domain/user-visibility.enum';
import { CreatePostCommand } from '../ports/in/commands/create-post.command';
import { CreatePostUseCase } from '../ports/in/use-cases/create-post.use-case';
import { PostDto } from '../ports/out/dto/post.dto';
import {
	PostThreadRepository,
	PostThreadRepositoryProvider,
} from '../ports/out/post-thread.repository';
import {
	PostRepository,
	PostRepositoryProvider,
} from '../ports/out/post.repository';
import { PostNotFoundError } from './errors/post-not-found.error';

@Injectable()
export class CreatePostService implements CreatePostUseCase {
	constructor(
		@Inject(PostRepositoryProvider)
		protected postRepository: PostRepository,
		@Inject(PostThreadRepositoryProvider)
		protected postThreadRepository: PostThreadRepository,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
		@Inject(GroupRepositoryProvider)
		protected groupRepository: GroupRepository,
		@Inject(CreateNotificationUseCaseProvider)
		protected createNotificationUseCase: CreateNotificationUseCase,
		@Inject(FileStorageProvider)
		protected fileStorage: FileStorage,
	) {}

	public async execute(command: CreatePostCommand): Promise<PostDto> {
		const authenticatedUser = await this.getAuthenticatedUser.execute(null);

		let visibility = command.visibility;

		if (visibility === null || visibility === undefined) {
			switch (authenticatedUser.visibilitySettings().posts()) {
				case UserVisibility.PUBLIC:
					visibility = PostVisibility.PUBLIC;
					break;
				case UserVisibility.PRIVATE:
					visibility = PostVisibility.PRIVATE;
					break;
				case UserVisibility.FOLLOWERS:
					visibility = PostVisibility.FOLLOWERS;
					break;
				default:
					visibility = PostVisibility.PUBLIC;
					break;
			}
		}

		let group: Group = null;

		if (command.groupId !== null && command.groupId !== undefined) {
			const g = await this.groupRepository.findById(command.groupId);

			if (g === null || g === undefined || g.isDeleted()) {
				throw new GroupNotFoundError();
			}

			group = g;
			switch (g.visibilitySettings().posts()) {
				case GroupVisibility.PRIVATE:
					visibility = PostVisibility.PRIVATE;
					break;
				case GroupVisibility.PUBLIC:
					visibility = PostVisibility.PUBLIC;
					break;
				default:
					visibility = PostVisibility.PUBLIC;
					break;
			}
		}

		let parent: Post = null;

		if (command.parentId !== null && command.parentId !== undefined) {
			const post = await this.postRepository.findById(command.parentId);

			if (post === null || post === undefined) {
				throw new PostNotFoundError(`Parent post not found`);
			}

			parent = post;
			visibility = parent.visibility();
		}

		const newPost = Post.create(
			randomUUID(),
			command.title,
			command.content,
			visibility,
			authenticatedUser,
			[],
			parent,
			group,
		);

		if (command.attachments) {
			for (const attachment of command.attachments) {
				const savedFile = await this.fileStorage.save(
					`posts/${newPost.id()}/attachments`,
					attachment
				);

				newPost.addAttachment(PostAttachment.create(
					randomUUID(),
					savedFile.path,
					attachment.mimetype,
				));
			}
		}

		if (newPost.thread().maxDepthLevel() === 0) {
			await this.postThreadRepository.store(newPost.thread());
		}

		this.postRepository.store(newPost);
		this.postThreadRepository.update(newPost.thread());

		if (parent && parent.creator().id() !== authenticatedUser.id() && parent !== null) {
			await this.createNotificationUseCase.execute(new CreateNotificationCommand(
				`New post`,
				`${authenticatedUser.profile().displayName()} answered to your post.`,
				NotificationType.NEW_POST,
				parent.creator().id(),
				new NotificationPayload(
					NotificationPayloadSubject.POST,
					parent.id(),
					{
						post_id: newPost.id(),
						user_id: authenticatedUser.id(),
						user_display_name: authenticatedUser.profile().displayName(),
						user_profile_picture: authenticatedUser.profile().profilePicture(),
					}
				)
			));
		}

		return PostDto.fromModel(newPost);
	}
}
