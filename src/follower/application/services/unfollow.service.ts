import { Inject, Injectable } from '@nestjs/common';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import {
	UserRepository,
	UserRepositoryProvider,
} from 'src/user/application/ports/out/user.repository';
import { UserNotFoundError } from 'src/user/application/services/errors/user-not-found.error';
import { UnfollowCommand } from '../ports/in/commands/unfollow.command';
import { UnfollowUseCase } from '../ports/in/use-cases/unfollow.use-case';
import {
	FollowRepository,
	FollowRepositoryProvider,
} from '../ports/out/follow.repository';
import { NotFollowingError } from './errors/not-following.error';

@Injectable()
export class UnfollowService implements UnfollowUseCase {
	public constructor(
		@Inject(UserRepositoryProvider)
		protected userRepository: UserRepository,
		@Inject(FollowRepositoryProvider)
		protected followRepository: FollowRepository,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
	) {}

	public async execute(command: UnfollowCommand): Promise<void> {
		const authenticatedUser = await this.getAuthenticatedUser.execute(null);

		if (command.fromUserId !== authenticatedUser.id()) {
			throw new UnauthorizedAccessError();
		}

		const toUser = await this.userRepository.findById(command.toUserId);

		if (toUser === null || toUser === undefined || toUser.isDeleted()) {
			throw new UserNotFoundError();
		}

		const follow = (
			await this.followRepository.findBy({
				fromUserId: authenticatedUser.id(),
				toUserId: toUser.id(),
			})
		).at(0);

		if (follow === null || follow === undefined) {
			throw new NotFollowingError();
		}

		this.followRepository.delete(follow.id());
	}
}
