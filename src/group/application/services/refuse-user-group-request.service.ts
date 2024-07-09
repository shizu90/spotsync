import { Inject, Injectable } from "@nestjs/common";
import { RefuseUserGroupRequestUseCase } from "../ports/in/use-cases/refuse-user-group-request.use-case";
import { UserGroupMemberRepository, UserGroupMemberRepositoryProvider } from "../ports/out/user-group-member.repository";
import { UserGroupRepository, UserGroupRepositoryProvider } from "../ports/out/user-group.repository";
import { RefuseUserGroupRequestCommand } from "../ports/in/commands/refuse-user-group-request.command";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { UserGroupNotFoundError } from "./errors/user-group-not-found.error";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-acess.error";

@Injectable()
export class RefuseUserGroupRequestService implements RefuseUserGroupRequestUseCase 
{
    constructor(
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
        @Inject(UserGroupMemberRepositoryProvider)
        protected userGroupMemberRepository: UserGroupMemberRepository,
        @Inject(UserGroupRepositoryProvider)
        protected userGroupRepository: UserGroupRepository
    ) 
    {}

    public async execute(command: RefuseUserGroupRequestCommand): Promise<void> 
    {
        const authenticatedUserId = this.getAuthenticatedUser.execute(null);

        const group = await this.userGroupRepository.findById(command.userGroupId);

        if(group === null || group === undefined) {
            throw new UserGroupNotFoundError(`Group not found`);
        }

        const authenticatedGroupMember = (await this.userGroupMemberRepository.findBy({userGroupId: command.userGroupId, userId: authenticatedUserId})).at(0);

        if(authenticatedGroupMember === null || authenticatedGroupMember === undefined) {
            throw new UnauthorizedAccessError(`Authenticated user is not a member of the group`);
        }

        const hasPermission = authenticatedGroupMember.role().permissions().map((p) => p.name()).includes('accept-requests');

        if(!hasPermission) {
            throw new UnauthorizedAccessError(`Authenticated user don't have permission to accept join request`);
        }

        this.userGroupMemberRepository.deleteRequest(command.userGroupRequestId);
    }
}