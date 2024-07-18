import { Inject, Injectable } from "@nestjs/common";
import { RemoveGroupMemberUseCase } from "../ports/in/use-cases/remove-group-member.use-case";
import { RemoveGroupMemberCommand } from "../ports/in/commands/remove-group-member.command";
import { GroupRepository, GroupRepositoryProvider } from "../ports/out/group.repository";
import { GroupMemberRepository, GroupMemberRepositoryProvider } from "../ports/out/group-member.repository";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { GroupNotFoundError } from "./errors/group-not-found.error";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-access.error";
import { GroupMemberNotFoundError } from "./errors/group-member-not-found.error";
import { GroupLog } from "src/group/domain/group-log.model";
import { randomUUID } from "crypto";

@Injectable()
export class RemoveGroupMemberService implements RemoveGroupMemberUseCase 
{
    constructor(
        @Inject(GroupRepositoryProvider)
        protected groupRepository: GroupRepository,
        @Inject(GroupMemberRepositoryProvider)
        protected groupMemberRepository: GroupMemberRepository,
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase
    ) 
    {}

    public async execute(command: RemoveGroupMemberCommand): Promise<void> 
    {
        const authenticatedUserId = this.getAuthenticatedUser.execute(null);

        const group = await this.groupRepository.findById(command.groupId);

        if(group === null || group === undefined || group.isDeleted()) {
            throw new GroupNotFoundError(`Group not found`);
        }

        const authenticatedGroupMember = (await this.groupMemberRepository.findBy({groupId: group.id(), userId: authenticatedUserId})).at(0);
    
        if(authenticatedGroupMember === null || authenticatedGroupMember === undefined) {
            throw new UnauthorizedAccessError(`You are not a member of the group`);
        }

        const hasPermission = authenticatedGroupMember.role().permissions().map((p) => p.name()).includes('remove-members');

        if(!(hasPermission || authenticatedGroupMember.isCreator() || authenticatedGroupMember.role().name() === 'administrator')) {
            throw new UnauthorizedAccessError(`You don't have permissions to remove members`);
        }

        const groupMember = await this.groupMemberRepository.findById(command.id);

        if(groupMember === null || groupMember === undefined) {
            throw new GroupMemberNotFoundError(`Group member not found`);
        }

        this.groupMemberRepository.delete(groupMember.id());

        const log = GroupLog.create(
            randomUUID(), 
            group, 
            `${authenticatedGroupMember.user().credentials().name()} removed the member ${groupMember.user().credentials().name()}`
        );

        this.groupRepository.storeLog(log);
    }
}