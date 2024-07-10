import { Inject, Injectable } from "@nestjs/common";
import { GetUserGroupUseCase } from "../ports/in/use-cases/get-user-group.use-case";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { UserGroupMemberRepository, UserGroupMemberRepositoryProvider } from "../ports/out/user-group-member.repository";
import { UserGroupRepository, UserGroupRepositoryProvider } from "../ports/out/user-group.repository";
import { GetUserGroupCommand } from "../ports/in/commands/get-user-group.command";
import { GetUserGroupDto } from "../ports/out/dto/get-user-group.dto";
import { UserGroupNotFoundError } from "./errors/user-group-not-found.error";

@Injectable()
export class GetUserGroupService implements GetUserGroupUseCase 
{
    constructor(
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
        @Inject(UserGroupMemberRepositoryProvider)
        protected userGroupMemberRepository: UserGroupMemberRepository,
        @Inject(UserGroupRepositoryProvider)
        protected userGroupRepository: UserGroupRepository
    ) 
    {}

    public async execute(command: GetUserGroupCommand): Promise<GetUserGroupDto> 
    {
        const authenticatedUserId = this.getAuthenticatedUser.execute(null);

        const group = await this.userGroupRepository.findById(command.userGroupId);

        if(group === null || group === undefined) {
            throw new UserGroupNotFoundError(`Group not found`);
        }

        const groupMember = (await this.userGroupMemberRepository.findBy({userGroupId: group.id(), userId: authenticatedUserId})).at(0);

        return new GetUserGroupDto(
            group.id(),
            group.name(),
            group.about(),
            group.groupPicture(),
            group.bannerPicture(),
            {
                group_visibility: group.visibilityConfiguration().groupVisibility(),
                post_visibility: group.visibilityConfiguration().postVisibility(),
                event_visibility: group.visibilityConfiguration().eventVisibility()
            },
            group.createdAt(),
            group.updatedAt(),
            groupMember ? true : false,
            groupMember ? {
                id: groupMember.id(),
                user_id: groupMember.user().id(),
                is_creator: groupMember.isCreator(),
                joined_at: groupMember.joinedAt(),
                role: {
                    id: groupMember.role().id(),
                    name: groupMember.role().name(),
                    permissions: groupMember.role().permissions().map((p) => p.name())
                }
            } : null
        );
    }
}