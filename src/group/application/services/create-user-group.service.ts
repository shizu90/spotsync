import { Inject, Injectable } from "@nestjs/common";
import { CreateUserGroupUseCase } from "../ports/in/use-cases/create-user-group.use-case";
import { UserGroupRepository, UserGroupRepositoryProvider } from "../ports/out/user-group.repository";
import { UserRepository, UserRepositoryProvider } from "src/user/application/ports/out/user.repository";
import { CreateUserGroupCommand } from "../ports/in/commands/create-user-group.command";
import { CreateUserGroupDto } from "../ports/out/dto/create-user-group.dto";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { UserNotFoundError } from "src/user/application/services/errors/user-not-found.error";
import { UserGroupMember } from "src/group/domain/user-group-member.model";
import { UserGroup } from "src/group/domain/user-group.model";
import { randomUUID } from "crypto";
import { UserGroupMemberRepository, UserGroupMemberRepositoryProvider } from "../ports/out/user-group-member.repository";
import { UserGroupRoleRepository, UserGroupRoleRepositoryProvider } from "../ports/out/user-group-role.repository";
import { UserGroupVisibilityConfig } from "src/group/domain/user-group-visibility-config.model";
import { UserGroupVisibility } from "src/group/domain/user-group-visibility.enum";

@Injectable()
export class CreateUserGroupService implements CreateUserGroupUseCase 
{
    constructor(
        @Inject(UserGroupRepositoryProvider)
        protected userGroupRepository: UserGroupRepository,
        @Inject(UserRepositoryProvider)
        protected userRepository: UserRepository,
        @Inject(UserGroupMemberRepositoryProvider)
        protected userGroupMemberRepository: UserGroupMemberRepository,
        @Inject(UserGroupRoleRepositoryProvider)
        protected userGroupRoleRepository: UserGroupRoleRepository,
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase
    )
    {}

    public async execute(command: CreateUserGroupCommand): Promise<CreateUserGroupDto> 
    {
        const authenticatedUserId = this.getAuthenticatedUser.execute(null);

        const authenticatedUser = await this.userRepository.findById(authenticatedUserId);

        if(authenticatedUser === null || authenticatedUser === undefined || authenticatedUser.isDeleted()) {
            throw new UserNotFoundError(`User not found`);
        }

        const adminRole = await this.userGroupRoleRepository.findByName('administrator');

        const groupId = randomUUID();

        const group = UserGroup.create(
            groupId,
            command.name,
            command.about,
            null,
            null,
            UserGroupVisibilityConfig.create(
                groupId,
                UserGroupVisibility.PUBLIC,
                UserGroupVisibility.PUBLIC,
                UserGroupVisibility.PUBLIC
            )
        );

        const creatorGroupMember = UserGroupMember.create(
            randomUUID(),
            group,
            authenticatedUser,
            adminRole,
            true
        );

        await this.userGroupRepository.store(group);

        this.userGroupMemberRepository.store(creatorGroupMember);

        return new CreateUserGroupDto(
            group.id(),
            group.name(),
            group.about(),
            group.groupPicture(),
            group.bannerPicture(),
            {
                post_visibility: group.visibilityConfiguration().postVisibility(),
                event_visibility: group.visibilityConfiguration().eventVisibility(),
                group_visibility: group.visibilityConfiguration().groupVisibility()
            },
            group.createdAt(),
            group.updatedAt()
        );
    }
}