import { Inject, Injectable } from "@nestjs/common";
import { UpdateUserGroupUseCase } from "../ports/in/use-cases/update-user-group.use-case";
import { UserGroupRepository, UserGroupRepositoryProvider } from "../ports/out/user-group.repository";
import { UpdateUserGroupCommand } from "../ports/in/commands/update-user-group.command";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { UserRepository, UserRepositoryProvider } from "src/user/application/ports/out/user.repository";
import { UserNotFoundError } from "src/user/application/services/errors/user-not-found.error";
import { UserGroupMemberRepository, UserGroupMemberRepositoryProvider } from "../ports/out/user-group-member.repository";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-acess.error";
import { UserGroupNotFoundError } from "./errors/user-group-not-found.error";

@Injectable()
export class UpdateUserGroupService implements UpdateUserGroupUseCase 
{
    constructor(
        @Inject(UserGroupRepositoryProvider)
        protected userGroupRepository: UserGroupRepository,
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
        @Inject(UserRepositoryProvider)
        protected userRepository: UserRepository,
        @Inject(UserGroupMemberRepositoryProvider)
        protected userGroupMemberRepository: UserGroupMemberRepository
    ) 
    {}

    public async execute(command: UpdateUserGroupCommand): Promise<void> 
    {
        const authenticatedUserId = this.getAuthenticatedUser.execute(null);

        const authenticatedUser = await this.userRepository.findById(authenticatedUserId);

        if(authenticatedUser === null || authenticatedUser === undefined || authenticatedUser.isDeleted()) {
            throw new UserNotFoundError(`User not found`);
        }

        const group = await this.userGroupRepository.findById(command.userGroupId);

        if(group === null || group === undefined) {
            throw new UserGroupNotFoundError(`Group not found`);
        }

        const groupMember = (await this.userGroupMemberRepository.findBy({userGroupId: group.id(), userId: authenticatedUserId})).at(0);

        if(groupMember === null || groupMember === undefined) {
            throw new UnauthorizedAccessError(`User is not a member of the group`);
        }

        const hasPermission = groupMember.role().permissions().map((gm) => gm.name()).includes('update-settings');

        if(!hasPermission) {
            throw new UnauthorizedAccessError(`User don't have permissions to update group data`);
        }

        if(command.name) {
            group.changeName(command.name);
        }

        if(command.about) {
            group.changeAbout(command.about);
        }

        this.userGroupRepository.update(group);
    }
}