import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { FollowStatus } from 'src/follower/domain/follow-status.enum';
import { Follow } from 'src/follower/domain/follow.model';
import { CreateNotificationCommand } from 'src/notification/application/ports/in/commands/create-notification.command';
import { CreateNotificationUseCase, CreateNotificationUseCaseProvider } from 'src/notification/application/ports/in/use-cases/create-notification.use-case';
import { NotificationType } from 'src/notification/domain/notification-type.enum';
import { NotificationPayload, NotificationPayloadSubject } from 'src/notification/domain/notification.model';
import {
	UserRepository,
	UserRepositoryProvider,
} from 'src/user/application/ports/out/user.repository';
import { UserNotFoundError } from 'src/user/application/services/errors/user-not-found.error';
import { UserVisibility } from 'src/user/domain/user-visibility.enum';
import { FollowCommand } from '../ports/in/commands/follow.command';
import { FollowUseCase } from '../ports/in/use-cases/follow.use-case';
import { FollowDto } from '../ports/out/dto/follow.dto';
import {
	FollowRepository,
	FollowRepositoryProvider,
} from '../ports/out/follow.repository';
import { AlreadyFollowingError } from './errors/already-following.error';
import { AlreadyRequestedFollowError } from './errors/already-requested-follow.error';

@Injectable()
export class FollowService implements FollowUseCase {
	constructor(
		@Inject(UserRepositoryProvider)
		protected userRepository: UserRepository,
		@Inject(FollowRepositoryProvider)
		protected followRepository: FollowRepository,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
		@Inject(CreateNotificationUseCaseProvider)
		protected createNotificationUseCase: CreateNotificationUseCase,
	) {}

	public async execute(command: FollowCommand): Promise<FollowDto> {
		const authenticatedUser = await this.getAuthenticatedUser.execute(null);

		if (command.fromUserId !== authenticatedUser.id()) {
			throw new UnauthorizedAccessError();
		}

		if (command.fromUserId === command.toUserId) {
			throw new AlreadyFollowingError();
		}

		const toUser = await this.userRepository.findById(command.toUserId);

		if (toUser === null || toUser === undefined || toUser.isDeleted()) {
			throw new UserNotFoundError();
		}

		let follow = (
			await this.followRepository.findBy({
				toUserId: toUser.id(),
				fromUserId: authenticatedUser.id(),
			})
		).at(0);

		if (follow !== null && follow !== undefined) {
			if (follow.status() === FollowStatus.ACTIVE) {
				throw new AlreadyFollowingError();
			}

			if (follow.status() === FollowStatus.REQUESTED) {
				throw new AlreadyRequestedFollowError();
			}
		}

		if (toUser.visibilitySettings().profile() !== UserVisibility.PUBLIC) {
			follow = Follow.create(
				randomUUID(),
				authenticatedUser,
				toUser,
				FollowStatus.REQUESTED,
				null,
				new Date(),
			);
		} else {
			follow = Follow.create(
				randomUUID(),
				authenticatedUser,
				toUser,
				FollowStatus.ACTIVE,
				new Date(),
				null,
			);
		}

		await this.followRepository.store(follow);

		if (toUser.visibilitySettings().profile() !== UserVisibility.PUBLIC) {
			await this.createNotificationUseCase.execute(new CreateNotificationCommand(
				`New follow request`,
				`${authenticatedUser.profile().displayName()} requested to follow you.`,
				NotificationType.NEW_FOLLOW,
				toUser.id(),
				new NotificationPayload(
					NotificationPayloadSubject.FOLLOW,
					null,
					{
						follower_id: authenticatedUser.id(),
						follower_display_name: authenticatedUser.profile().displayName(),
						follower_profile_picture: authenticatedUser.profile().profilePicture(),
					}
				)
			));
		} else {
			await this.createNotificationUseCase.execute(new CreateNotificationCommand(
				`New follow`,
				`${authenticatedUser.profile().displayName()} followed you.`,
				NotificationType.NEW_FOLLOW,
				toUser.id(),
				new NotificationPayload(
					NotificationPayloadSubject.FOLLOW,
					null,
					{
						follower_id: authenticatedUser.id(),
						follower_display_name: authenticatedUser.profile().displayName(),
						follower_profile_picture: authenticatedUser.profile().profilePicture(),
					}
				)
			));
		}

		return FollowDto.fromModel(follow);
	}
}
