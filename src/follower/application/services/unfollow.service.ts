import { Inject, Injectable } from '@nestjs/common';
import { UnfollowUseCase } from '../ports/in/use-cases/unfollow.use-case';
import {
	UserRepository,
	UserRepositoryProvider,
} from 'src/user/application/ports/out/user.repository';
import {
	FollowRepository,
	FollowRepositoryProvider,
} from '../ports/out/follow.repository';
import { UnfollowCommand } from '../ports/in/commands/unfollow.command';
import { UserNotFoundError } from 'src/user/application/services/errors/user-not-found.error';
import { NotFollowingError } from './errors/not-following.error';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';

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
		const fromUser = await this.userRepository.findById(command.fromUserId);

		if (
			fromUser === null ||
			fromUser === undefined ||
			fromUser.isDeleted()
		) {
			throw new UserNotFoundError(`From user not found`);
		}

		if (fromUser.id() !== this.getAuthenticatedUser.execute(null)) {
			throw new UnauthorizedAccessError(`Unauthorized access`);
		}

		const toUser = await this.userRepository.findById(command.toUserId);

		if (toUser === null || toUser === undefined || toUser.isDeleted()) {
			throw new UserNotFoundError(`To user not found`);
		}

		const follow = (
			await this.followRepository.findBy({
				fromUserId: fromUser.id(),
				toUserId: toUser.id(),
			})
		).at(0);

		if (follow === null || follow === undefined) {
			throw new NotFollowingError(`Not following user`);
		}

		this.followRepository.delete(follow.id());
	}
}
