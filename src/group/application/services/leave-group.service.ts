import { Inject, Injectable } from "@nestjs/common";
import { LeaveGroupUseCase } from "../ports/in/use-cases/leave-group.use-case";
import { LeaveGroupCommand } from "../ports/in/commands/leave-group.command";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { GroupRepository, GroupRepositoryProvider } from "../ports/out/group.repository";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-acess.error";
import { GroupMemberRepository, GroupMemberRepositoryProvider } from "../ports/out/group-member.repository";
import { GroupNotFoundError } from "./errors/group-not-found.error";

@Injectable()
export class LeaveGroupService implements LeaveGroupUseCase 
{
    constructor(
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
        @Inject(GroupRepositoryProvider)
        protected groupRepository: GroupRepository,
        @Inject(GroupMemberRepositoryProvider)
        protected groupMemberRepository: GroupMemberRepository
    ) 
    {}

    public async execute(command: LeaveGroupCommand): Promise<void> 
    {
        const authenticatedUserId = this.getAuthenticatedUser.execute(null);

        const group = await this.groupRepository.findById(command.id);

        if(group === null || group === undefined) {
            throw new GroupNotFoundError(`Group not found`);
        }

        const groupMember = (await this.groupRepository.findBy({groupId: group.id(), userId: authenticatedUserId})).at(0);

        if(groupMember === null || groupMember === undefined) {
            throw new UnauthorizedAccessError(`Authenticated user is not a member of the group`);
        }

        this.groupMemberRepository.delete(groupMember.id());
    }
}