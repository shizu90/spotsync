import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { FollowRequest } from 'src/follower/domain/follow-request.model';
import { Follow } from 'src/follower/domain/follow.model';
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
	) {}

	public async execute(command: FollowCommand): Promise<FollowDto> {
		const authenticatedUser = await this.getAuthenticatedUser.execute(null);

		if (command.fromUserId !== authenticatedUser.id()) {
			throw new UnauthorizedAccessError(`Unauthorized access`);
		}

		if (command.fromUserId === command.toUserId) {
			throw new AlreadyFollowingError(
				`To user must be a different user.`,
			);
		}

		const toUser = await this.userRepository.findById(command.toUserId);

		if (toUser === null || toUser === undefined || toUser.isDeleted()) {
			throw new UserNotFoundError(`To user not found`);
		}

		let follow = (
			await this.followRepository.findBy({
				toUserId: toUser.id(),
				fromUserId: authenticatedUser.id(),
			})
		).at(0);

		if (follow !== null && follow !== undefined) {
			throw new AlreadyFollowingError(`Already following user`);
		}

		if (
			toUser.visibilitySettings().profile() !== UserVisibility.PUBLIC
		) {
			const request = (
				await this.followRepository.findRequestBy({
					fromUserId: authenticatedUser.id(),
					toUserId: toUser.id(),
				})
			).at(0);

			if (request !== null && request !== undefined) {
				throw new AlreadyRequestedFollowError(
					`Already requested to follow`,
				);
			}

			const followRequest = FollowRequest.create(
				randomUUID(),
				authenticatedUser,
				toUser,
			);

			this.followRepository.storeRequest(followRequest);

			return new FollowDto(
				followRequest.id(),
				followRequest.from().id(),
				followRequest.to().id(),
				null,
				followRequest.requestedOn(),
			);
		} else {
			follow = Follow.create(randomUUID(), authenticatedUser, toUser);

			this.followRepository.store(follow);

			return new FollowDto(
				follow.id(),
				follow.from().id(),
				follow.to().id(),
				follow.followedAt(),
				follow.followedAt(),
			);
		}
	}
}
