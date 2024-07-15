import { Inject, Injectable } from "@nestjs/common";
import { ChangeMemberRoleUseCase } from "../ports/in/use-cases/change-member-role.use-case";
import { GroupMemberRepository, GroupMemberRepositoryProvider } from "../ports/out/group-member.repository";
import { GroupRepository, GroupRepositoryProvider } from "../ports/out/group.repository";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { ChangeMemberRoleCommand } from "../ports/in/commands/change-member-role.command";
import { GroupNotFoundError } from "./errors/group-not-found.error";
import { GroupMemberNotFoundError } from "./errors/group-member-not-found.error";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-access.error";
import { GroupRoleRepository, GroupRoleRepositoryProvider } from "../ports/out/group-role.repository";
import { GroupRoleNotFoundError } from "./errors/group-role-not-found.error";

@Injectable()
export class ChangeMemberRoleService implements ChangeMemberRoleUseCase 
{
    constructor(
        @Inject(GroupMemberRepositoryProvider)
        protected groupMemberRepository: GroupMemberRepository,
        @Inject(GroupRepositoryProvider)
        protected groupRepository: GroupRepository,
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
        @Inject(GroupRoleRepositoryProvider)
        protected groupRoleRepository: GroupRoleRepository
    ) 
    {}

    public async execute(command: ChangeMemberRoleCommand): Promise<void> 
    {
        const authenticatedUserId = this.getAuthenticatedUser.execute(null);

        const group = await this.groupRepository.findById(command.groupId);

        if(group === null || group === undefined || group.isDeleted()) {
            throw new GroupNotFoundError(`Group not found`);
        }

        const authenticatedGroupMember = (await this.groupMemberRepository.findBy({groupId: group.id(), userId: authenticatedUserId})).at(0);

        if(authenticatedGroupMember === null || authenticatedGroupMember === undefined) {
            throw new GroupMemberNotFoundError(`You are not a member of the group`);
        }

        const hasPermission = authenticatedGroupMember.role().permissions().map((p) => p.name()).includes('change-role');

        if(!(hasPermission || authenticatedGroupMember.isCreator() || authenticatedGroupMember.role().name() === 'administrator')) {
            throw new UnauthorizedAccessError(`You don't have permissions to change member role`);
        }

        const groupMember = await this.groupMemberRepository.findById(command.id);

        if(groupMember === null || groupMember === undefined) {
            throw new GroupMemberNotFoundError(`Group member not found`);
        }

        const role = await this.groupRoleRepository.findById(command.roleId);

        if(role === null || role === undefined) {
            throw new GroupRoleNotFoundError(`Group role not found`);
        }

        groupMember.changeRole(role);

        this.groupMemberRepository.update(groupMember);
    }
}