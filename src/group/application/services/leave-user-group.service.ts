import { Inject, Injectable } from "@nestjs/common";
import { LeaveUserGroupUseCase } from "../ports/in/use-cases/leave-user-group.use-case";
import { LeaveUserGroupCommand } from "../ports/in/commands/leave-user-group.command";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { UserGroupRepository, UserGroupRepositoryProvider } from "../ports/out/user-group.repository";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-acess.error";
import { UserGroupMemberRepository, UserGroupMemberRepositoryProvider } from "../ports/out/user-group-member.repository";
import { UserGroupNotFoundError } from "./errors/user-group-not-found.error";

@Injectable()
export class LeaveUserGroupService implements LeaveUserGroupUseCase 
{
    constructor(
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
        @Inject(UserGroupRepositoryProvider)
        protected userGroupRepository: UserGroupRepository,
        @Inject(UserGroupMemberRepositoryProvider)
        protected userGroupMemberRepository: UserGroupMemberRepository
    ) 
    {}

    public async execute(command: LeaveUserGroupCommand): Promise<void> 
    {
        const authenticatedUserId = this.getAuthenticatedUser.execute(null);

        const group = await this.userGroupRepository.findById(command.userGroupId);

        if(group === null || group === undefined) {
            throw new UserGroupNotFoundError(`Group not found`);
        }

        const groupMember = (await this.userGroupRepository.findBy({userGroupId: group.id(), userId: authenticatedUserId})).at(0);

        if(groupMember === null || groupMember === undefined) {
            throw new UnauthorizedAccessError(`Authenticated user is not a member of the group`);
        }

        this.userGroupMemberRepository.delete(groupMember.id());
    }
}