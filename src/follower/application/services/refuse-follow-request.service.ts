import { Inject, Injectable } from '@nestjs/common';
import { RefusseFollowRequestUseCase } from '../ports/in/use-cases/refuse-follow-request.use-case';
import {
  GetAuthenticatedUserUseCase,
  GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import {
  FollowRepository,
  FollowRepositoryProvider,
} from '../ports/out/follow.repository';
import { RefuseFollowRequestCommand } from '../ports/in/commands/refuse-follow-request.command';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { FollowRequestNotFoundError } from './errors/follow-request-not-found.error';

@Injectable()
export class RefuseFollowRequestService implements RefusseFollowRequestUseCase {
  constructor(
    @Inject(GetAuthenticatedUserUseCaseProvider)
    protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
    @Inject(FollowRepositoryProvider)
    protected followRepository: FollowRepository,
  ) {}

  public async execute(command: RefuseFollowRequestCommand): Promise<void> {
    const authenticatedUserId = this.getAuthenticatedUser.execute(null);

    const followRequest = await this.followRepository.findRequestById(
      command.followRequestId,
    );

    if (followRequest === null || followRequest === undefined) {
      throw new FollowRequestNotFoundError(`Follow request not found`);
    }

    if (authenticatedUserId !== followRequest.to().id()) {
      throw new UnauthorizedAccessError(`Unauthorized access`);
    }

    this.followRepository.deleteRequest(followRequest.id());
  }
}
