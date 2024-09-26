import { Inject, Injectable } from '@nestjs/common';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { FollowStatus } from 'src/follower/domain/follow-status.enum';
import { RefuseFollowRequestCommand } from '../ports/in/commands/refuse-follow-request.command';
import { RefuseFollowRequestUseCase } from '../ports/in/use-cases/refuse-follow-request.use-case';
import {
	FollowRepository,
	FollowRepositoryProvider,
} from '../ports/out/follow.repository';
import { FollowRequestNotFoundError } from './errors/follow-request-not-found.error';

@Injectable()
export class RefuseFollowRequestService implements RefuseFollowRequestUseCase {
	constructor(
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
		@Inject(FollowRepositoryProvider)
		protected followRepository: FollowRepository,
	) {}

	public async execute(command: RefuseFollowRequestCommand): Promise<void> {
		const authenticatedUser = await this.getAuthenticatedUser.execute(null);

		const followRequest = (await this.followRepository.findBy({
			id: command.id,
			status: FollowStatus.REQUESTED,
		})).at(0);

		if (followRequest === null || followRequest === undefined) {
			throw new FollowRequestNotFoundError();
		}

		if (authenticatedUser.id() !== followRequest.to().id()) {
			throw new UnauthorizedAccessError();
		}

		this.followRepository.delete(followRequest.id());
	}
}
