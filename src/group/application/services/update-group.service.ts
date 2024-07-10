import { Inject, Injectable } from "@nestjs/common";
import { UpdateGroupUseCase } from "../ports/in/use-cases/update-group.use-case";
import { GroupRepository, GroupRepositoryProvider } from "../ports/out/group.repository";
import { UpdateGroupCommand } from "../ports/in/commands/update-group.command";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { UserRepository, UserRepositoryProvider } from "src/user/application/ports/out/user.repository";
import { UserNotFoundError } from "src/user/application/services/errors/user-not-found.error";
import { GroupMemberRepository, GroupMemberRepositoryProvider } from "../ports/out/group-member.repository";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-acess.error";
import { GroupNotFoundError } from "./errors/group-not-found.error";

@Injectable()
export class UpdateGroupService implements UpdateGroupUseCase 
{
    constructor(
        @Inject(GroupRepositoryProvider)
        protected groupRepository: GroupRepository,
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
        @Inject(UserRepositoryProvider)
        protected userRepository: UserRepository,
        @Inject(GroupMemberRepositoryProvider)
        protected groupMemberRepository: GroupMemberRepository
    ) 
    {}

    public async execute(command: UpdateGroupCommand): Promise<void> 
    {
        const authenticatedUserId = this.getAuthenticatedUser.execute(null);

        const authenticatedUser = await this.userRepository.findById(authenticatedUserId);

        if(authenticatedUser === null || authenticatedUser === undefined || authenticatedUser.isDeleted()) {
            throw new UserNotFoundError(`User not found`);
        }

        const group = await this.groupRepository.findById(command.id);

        if(group === null || group === undefined) {
            throw new GroupNotFoundError(`Group not found`);
        }

        const groupMember = (await this.groupMemberRepository.findBy({groupId: group.id(), userId: authenticatedUserId})).at(0);

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

        this.groupRepository.update(group);
    }
}