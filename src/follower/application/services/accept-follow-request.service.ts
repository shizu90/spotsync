import { Inject, Injectable } from "@nestjs/common";
import { AcceptFollowRequestUseCase } from "../ports/in/use-cases/accept-follow-request.use-case";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { FollowRepository, FollowRepositoryProvider } from "../ports/out/follow.repository";
import { AcceptFollowRequestCommand } from "../ports/in/commands/accept-follow-request.command";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-access.error";
import { FollowRequestNotFoundError } from "./errors/follow-request-not-found.error";

@Injectable()
export class AcceptFollowRequestService implements AcceptFollowRequestUseCase 
{
    constructor(
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
        @Inject(FollowRepositoryProvider)
        protected followRepository: FollowRepository
    ) 
    {}

    public async execute(command: AcceptFollowRequestCommand): Promise<void> 
    {
        const authenticatedUserId = this.getAuthenticatedUser.execute(null);

        const followRequest = await this.followRepository.findRequestById(command.followRequestId);

        if(followRequest === null || followRequest === undefined) {
            throw new FollowRequestNotFoundError(`Follow request not found`);
        }

        if(authenticatedUserId !== followRequest.to().id()) {
            throw new UnauthorizedAccessError(`Unauthorized access`);
        }

        const follow = followRequest.accept();

        await this.followRepository.store(follow);

        this.followRepository.deleteRequest(followRequest.id());
    }
}