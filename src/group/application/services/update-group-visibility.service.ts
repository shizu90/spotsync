import { Inject, Injectable } from "@nestjs/common";
import { UpdateGroupVisibilityUseCase } from "../ports/in/use-cases/update-group-visibility.use-case";
import { UserRepository, UserRepositoryProvider } from "src/user/application/ports/out/user.repository";
import { GroupRepository, GroupRepositoryProvider } from "../ports/out/group.repository";
import { GroupMemberRepository, GroupMemberRepositoryProvider } from "../ports/out/group-member.repository";
import { UpdateGroupVisibilityCommand } from "../ports/in/commands/update-group-visibility.command";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { UserNotFoundError } from "src/user/application/services/errors/user-not-found.error";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-acess.error";
import { GroupNotFoundError } from "./errors/group-not-found.error";

@Injectable()
export class UpdateGroupVisibilityService implements UpdateGroupVisibilityUseCase 
{
    constructor(
        @Inject(UserRepositoryProvider)
        protected userRepository: UserRepository,
        @Inject(GroupRepositoryProvider)
        protected groupRepository: GroupRepository,
        @Inject(GroupMemberRepositoryProvider)
        protected groupMemberRepository: GroupMemberRepository,
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase
    ) 
    {}

    public async execute(command: UpdateGroupVisibilityCommand): Promise<void> 
    {
        const authenticatedUserId = this.getAuthenticatedUser.execute(null);

        const authenticatedUser = await this.userRepository.findById(authenticatedUserId);

        if(authenticatedUser === null || authenticatedUser === undefined || authenticatedUser.isDeleted()) {
            throw new UserNotFoundError(`User not found`);
        }

        const group = await this.groupRepository.findById(command.id);

        if(group === null || group === undefined || group.isDeleted()) {
            throw new GroupNotFoundError(`Group not found`);
        }

        const authenticatedGroupMember = (await this.groupMemberRepository.findBy({groupId: group.id(), userId: authenticatedUserId})).at(0);

        if(authenticatedGroupMember === null || authenticatedGroupMember === undefined) {
            throw new UnauthorizedAccessError(`You are not a member of the group`);
        }

        const hasPermission = authenticatedGroupMember.role().permissions().map((gm) => gm.name()).includes('update-settings');

        if(!(hasPermission || authenticatedGroupMember.isCreator() || authenticatedGroupMember.role().name() === 'adminitrator')) {
            throw new UnauthorizedAccessError(`You don't have permissions to update group settings`);
        }

        if(command.eventVisibility && command.eventVisibility !== null && command.eventVisibility.length > 0) {
            group.visibilityConfiguration().changeEventVisibility(command.eventVisibility);
        }

        if(command.postVisibility && command.postVisibility !== null && command.postVisibility.length > 0) {
            group.visibilityConfiguration().changePostVisibility(command.postVisibility);
        }

        if(command.groupVisibility && command.groupVisibility !== null && command.groupVisibility.length > 0) {
            group.visibilityConfiguration().changeGroupVisibility(command.groupVisibility);
        }

        this.groupRepository.updateVisibilityConfiguration(group.visibilityConfiguration());
    }
}