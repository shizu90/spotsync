import { Inject, Injectable } from "@nestjs/common";
import { FollowUseCase } from "../ports/in/use-cases/follow.use-case";
import { FollowCommand } from "../ports/in/commands/follow.command";
import { FollowDto } from "../ports/out/dto/follow.dto";
import { UserRepository, UserRepositoryProvider } from "src/user/application/ports/out/user.repository";
import { UserNotFoundError } from "src/user/application/services/errors/user-not-found.error";
import { FollowRepository, FollowRepositoryProvider } from "../ports/out/follow.repository";
import { AlreadyFollowingError } from "./errors/already-following.error";
import { Follow } from "src/follower/domain/follow.model";
import { randomUUID } from "crypto";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-acess.error";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { UserVisibility } from "src/user/domain/user-visibility.enum";
import { FollowRequest } from "src/follower/domain/follow-request.model";

@Injectable()
export class FollowService implements FollowUseCase 
{
    constructor(
        @Inject(UserRepositoryProvider)
        protected userRepository: UserRepository,
        @Inject(FollowRepositoryProvider)
        protected followRepository: FollowRepository,
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase
    ) 
    {}

    public async execute(command: FollowCommand): Promise<FollowDto> 
    {
        if(command.fromUserId === command.toUserId) {
            throw new AlreadyFollowingError(`To user must be a different user.`);
        }

        const fromUser = await this.userRepository.findById(command.fromUserId);

        if(fromUser === null || fromUser === undefined || fromUser.isDeleted()) {
            throw new UserNotFoundError(`From user not found`);
        }

        if(fromUser.id() !== this.getAuthenticatedUser.execute(null)) {
            throw new UnauthorizedAccessError(`Unauthorized access`);
        }

        const toUser = await this.userRepository.findById(command.toUserId);

        if(toUser === null || toUser === undefined || toUser.isDeleted()) {
            throw new UserNotFoundError(`To user not found`);
        }

        let follow = (await this.followRepository.findBy({toUserId: toUser.id(), fromUserId: fromUser.id()})).at(0); 

        if(follow !== null && follow !== undefined) {
            throw new AlreadyFollowingError(`Already following user`);
        }

        if(toUser.visibilityConfiguration().profileVisibility() !== UserVisibility.PUBLIC) {
            const followRequest = FollowRequest.create(
                randomUUID(),
                fromUser,
                toUser
            );

            return new FollowDto(
                followRequest.id(),
                followRequest.from().id(),
                followRequest.to().id(),
                null,
                followRequest.requestedOn()
            )
        }else {
            follow = Follow.create(
                randomUUID(),
                fromUser,
                toUser
            );
    
            this.followRepository.store(follow);
    
            return new FollowDto(
                follow.id(),
                follow.from().id(),
                follow.to().id(),
                follow.followedAt(),
                follow.followedAt()
            );
        }
    }
}