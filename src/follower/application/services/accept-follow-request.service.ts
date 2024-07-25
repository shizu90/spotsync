import { Inject, Injectable } from '@nestjs/common';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { AcceptFollowRequestCommand } from '../ports/in/commands/accept-follow-request.command';
import { AcceptFollowRequestUseCase } from '../ports/in/use-cases/accept-follow-request.use-case';
import {
	FollowRepository,
	FollowRepositoryProvider,
} from '../ports/out/follow.repository';
import { FollowRequestNotFoundError } from './errors/follow-request-not-found.error';

@Injectable()
export class AcceptFollowRequestService implements AcceptFollowRequestUseCase {
	constructor(
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
		@Inject(FollowRepositoryProvider)
		protected followRepository: FollowRepository,
	) {}

	public async execute(command: AcceptFollowRequestCommand): Promise<void> {
		const authenticatedUser = await this.getAuthenticatedUser.execute(null);

		const followRequest = await this.followRepository.findRequestById(
			command.followRequestId,
		);

		if (followRequest === null || followRequest === undefined) {
			throw new FollowRequestNotFoundError(`Follow request not found`);
		}

		if (authenticatedUser.id() !== followRequest.to().id()) {
			throw new UnauthorizedAccessError(`Unauthorized access`);
		}

		const follow = followRequest.accept();

		await this.followRepository.store(follow);

		this.followRepository.deleteRequest(followRequest.id());
	}
}
