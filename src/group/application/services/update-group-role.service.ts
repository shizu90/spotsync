import { Inject, Injectable } from "@nestjs/common";
import { GroupRepository, GroupRepositoryProvider } from "../ports/out/group.repository";
import { GroupMemberRepository, GroupMemberRepositoryProvider } from "../ports/out/group-member.repository";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { UpdateGroupRoleUseCase } from "../ports/in/use-cases/update-group-role.use-case";
import { UpdateGroupRoleCommand } from "../ports/in/commands/update-group-role.command";
import { GroupRoleRepositoryImpl } from "src/group/infrastructure/adapters/out/group-role.db";
import { GroupRoleRepository } from "../ports/out/group-role.repository";
import { GroupNotFoundError } from "./errors/group-not-found.error";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-acess.error";
import { GroupRoleNotFoundError } from "./errors/group-role-not-found.error";

@Injectable()
export class UpdateGroupRoleService implements UpdateGroupRoleUseCase 
{
    constructor(
        @Inject(GroupRepositoryProvider)
        protected groupRepository: GroupRepository,
        @Inject(GroupMemberRepositoryProvider)
        protected groupMemberRepository: GroupMemberRepository,
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
        @Inject(GroupRoleRepositoryImpl)
        protected groupRoleRepository: GroupRoleRepository
    ) 
    {}

    public async execute(command: UpdateGroupRoleCommand): Promise<void> 
    {
        const authenticatedUserId = this.getAuthenticatedUser.execute(null);

        const group = await this.groupRepository.findById(command.groupId);

        if(group === null || group === undefined || group.isDeleted()) {
            throw new GroupNotFoundError(`Group not found`);
        }

        const authenticatedGroupMember = (await this.groupMemberRepository.findBy({groupId: group.id(), userId: authenticatedUserId})).at(0);

        if(authenticatedGroupMember === null || authenticatedGroupMember === undefined) {
            throw new UnauthorizedAccessError(`You're not a member of the group`);
        }

        const hasPermission = authenticatedGroupMember.role().permissions().map((p) => p.name()).includes('update-role');

        if(!(hasPermission || authenticatedGroupMember.isCreator() || authenticatedGroupMember.role().name() === 'administrator')) {
            throw new UnauthorizedAccessError(`You don't have permissions to update role`);
        }

        const groupRole = await this.groupRoleRepository.findById(command.id);

        if(groupRole === null || groupRole === undefined) {
            throw new GroupRoleNotFoundError(`Group role not found`);
        }

        if(command.name && command.name !== null) {
            groupRole.changeName(command.name);
        }

        if(command.hexColor && command.hexColor !== null) {
            groupRole.changeHexColor(command.hexColor);
        }

        if(command.permissionIds && command.permissionIds.length > 0) {
            groupRole.permissions().forEach((p) => {
                groupRole.removePermission(p);
            });

            command.permissionIds.forEach(async (pid) => {
                const permission = await this.groupRoleRepository.findPermissionById(pid);

                if(permission !== null && permission !== undefined) {
                    groupRole.addPermission(permission);
                }
            });
        }

        this.groupRoleRepository.update(groupRole);
    }
}