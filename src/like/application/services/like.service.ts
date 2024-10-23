import { Inject, Injectable } from '@nestjs/common';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { CommentRepository, CommentRepositoryProvider } from 'src/comment/application/ports/out/comment.repository';
import { Comment } from 'src/comment/domain/comment.model';
import { LikableSubject } from 'src/like/domain/likable-subject.enum';
import { Likable } from 'src/like/domain/likable.interface';
import { CreateNotificationCommand } from 'src/notification/application/ports/in/commands/create-notification.command';
import { CreateNotificationUseCase, CreateNotificationUseCaseProvider } from 'src/notification/application/ports/in/use-cases/create-notification.use-case';
import { NotificationType } from 'src/notification/domain/notification-type.enum';
import { NotificationPayload, NotificationPayloadSubject } from 'src/notification/domain/notification.model';
import {
	PostRepository,
	PostRepositoryProvider,
} from 'src/post/application/ports/out/post.repository';
import { Post } from 'src/post/domain/post.model';
import { LikeCommand } from '../ports/in/commands/like.command';
import { LikeUseCase } from '../ports/in/use-cases/like.use-case';
import { LikeDto } from '../ports/out/dto/like.dto';
import {
	LikeRepository,
	LikeRepositoryProvider,
} from '../ports/out/like.repository';
import { LikableNotFoundError } from './errors/likable-not-found.error';

@Injectable()
export class LikeService implements LikeUseCase {
	constructor(
		@Inject(LikeRepositoryProvider)
		protected likeRepository: LikeRepository,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
		@Inject(PostRepositoryProvider)
		protected postRepository: PostRepository,
		@Inject(CommentRepositoryProvider)
		protected commentRepository: CommentRepository,
		@Inject(CreateNotificationUseCaseProvider)
		protected createNotificationUseCase: CreateNotificationUseCase,
	) {}

	public async execute(command: LikeCommand): Promise<LikeDto> {
		const authenticatedUser = await this.getAuthenticatedUser.execute(null);

		let likable: Likable = null;
		let creatorId: string;

		switch (command.subject) {
			case LikableSubject.POST:
				likable = await this.postRepository.findById(command.subjectId);
				creatorId = (likable as Post).creator().id();
				break;
			case LikableSubject.COMMENT:
				likable = await this.commentRepository.findById(command.subjectId);
				creatorId = (likable as Comment).user().id();
				break;
			default:
				break;
		}

		if (likable === null || likable === undefined) {
			throw new LikableNotFoundError();
		}

		const like = likable.like(authenticatedUser);

		await this.likeRepository.store(like);

		if (likable instanceof Post) {
			await this.postRepository.update(likable);
		} else if (likable instanceof Comment) {
			await this.commentRepository.update(likable);
		}

		if (authenticatedUser.id() !== creatorId) {
			let payloadSubject;

			switch (command.subject) {
				case LikableSubject.POST:
					payloadSubject = NotificationPayloadSubject.POST;
					break;
				case LikableSubject.COMMENT:
					payloadSubject = NotificationPayloadSubject.COMMENT;
					break;
				default:
					break;
			}

			await this.createNotificationUseCase.execute(new CreateNotificationCommand(
				`New like`,
				`${authenticatedUser.profile().displayName()} liked your post.`,
				NotificationType.NEW_LIKE,
				creatorId,
				new NotificationPayload(
					payloadSubject,
					command.subjectId,
					{
						liker_id: authenticatedUser.id(),
						liker_display_name: authenticatedUser.profile().displayName(),
						liker_profile_picture: authenticatedUser.profile().profilePicture(),
					}
				)
			));
		}

		return LikeDto.fromModel(like);
	}
}
