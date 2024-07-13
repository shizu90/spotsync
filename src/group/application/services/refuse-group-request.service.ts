import { Inject, Injectable } from "@nestjs/common";
import { RefuseGroupRequestUseCase } from "../ports/in/use-cases/refuse-group-request.use-case";
import { GroupMemberRepository, GroupMemberRepositoryProvider } from "../ports/out/group-member.repository";
import { GroupRepository, GroupRepositoryProvider } from "../ports/out/group.repository";
import { RefuseGroupRequestCommand } from "../ports/in/commands/refuse-group-request.command";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { GroupNotFoundError } from "./errors/group-not-found.error";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-acess.error";

@Injectable()
export class RefuseGroupRequestService implements RefuseGroupRequestUseCase 
{
    constructor(
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
        @Inject(GroupMemberRepositoryProvider)
        protected groupMemberRepository: GroupMemberRepository,
        @Inject(GroupRepositoryProvider)
        protected groupRepository: GroupRepository
    ) 
    {}

    public async execute(command: RefuseGroupRequestCommand): Promise<void> 
    {
        const authenticatedUserId = this.getAuthenticatedUser.execute(null);

        const group = await this.groupRepository.findById(command.groupId);

        if(group === null || group === undefined || group.isDeleted()) {
            throw new GroupNotFoundError(`Group not found`);
        }

        const authenticatedGroupMember = (await this.groupMemberRepository.findBy({groupId: command.id, userId: authenticatedUserId})).at(0);

        if(authenticatedGroupMember === null || authenticatedGroupMember === undefined) {
            throw new UnauthorizedAccessError(`You are not a member of the group`);
        }

        const hasPermission = authenticatedGroupMember.role().permissions().map((p) => p.name()).includes('accept-requests');

        if(!(hasPermission || authenticatedGroupMember.isCreator() || authenticatedGroupMember.role().name() === 'administrator')) {
            throw new UnauthorizedAccessError(`You don't have permissions to accept join request`);
        }

        this.groupMemberRepository.deleteRequest(command.id);
    }
}