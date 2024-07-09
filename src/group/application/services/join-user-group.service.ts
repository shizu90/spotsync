import { Inject, Injectable } from "@nestjs/common";
import { JoinUserGroupUseCase } from "../ports/in/use-cases/join-user-group.use-case";
import { UserRepository, UserRepositoryProvider } from "src/user/application/ports/out/user.repository";
import { UserGroupRepository, UserGroupRepositoryProvider } from "../ports/out/user-group.repository";
import { UserGroupMemberRepository, UserGroupMemberRepositoryProvider } from "../ports/out/user-group-member.repository";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { JoinUserGroupCommand } from "../ports/in/commands/join-user-group.command";
import { JoinUserGroupDto } from "../ports/out/dto/join-user-group.dto";
import { AcceptUserGroupRequestDto } from "../ports/out/dto/accept-user-group-request.dto";
import { UserNotFoundError } from "src/user/application/services/errors/user-not-found.error";
import { UserGroupVisibility } from "src/group/domain/user-group-visibility.enum";
import { UserGroupMemberRequest } from "src/group/domain/user-group-member-request.model";
import { randomUUID } from "crypto";
import { UserGroupMember } from "src/group/domain/user-group-member.model";
import { UserGroupRoleRepository, UserGroupRoleRepositoryProvider } from "../ports/out/user-group-role.repository";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-acess.error";

@Injectable()
export class JoinUserGroupService implements JoinUserGroupUseCase 
{
    constructor(
        @Inject(UserRepositoryProvider)
        protected userRepository: UserRepository,
        @Inject(UserGroupRepositoryProvider)
        protected userGroupRepository: UserGroupRepository,
        @Inject(UserGroupMemberRepositoryProvider)
        protected userGroupMemberRepository: UserGroupMemberRepository,
        @Inject(UserGroupRoleRepositoryProvider)
        protected userGroupRoleRepository: UserGroupRoleRepository,
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase
    ) 
    {}

    public async execute(command: JoinUserGroupCommand): Promise<JoinUserGroupDto | AcceptUserGroupRequestDto> 
    {
        const authenticatedUserId = this.getAuthenticatedUser.execute(null);

        const user = await this.userRepository.findById(command.userId);

        if(user === null || user === undefined || user.isDeleted()) {
            throw new UserNotFoundError(`User not found`);
        }

        if(user.id() !== authenticatedUserId) {
            throw new UnauthorizedAccessError(`Unauthorized access`);
        }

        const group = await this.userGroupRepository.findById(command.userGroupId);

        if(group.visibilityConfiguration().groupVisibility() === UserGroupVisibility.PRIVATE) {
            const groupMemberRequest = UserGroupMemberRequest.create(
                randomUUID(),
                group,
                user
            );

            this.userGroupMemberRepository.storeRequest(groupMemberRequest);

            return new JoinUserGroupDto(
                groupMemberRequest.id(),
                group.id(),
                user.id()
            );
        }else {
            const memberRole = await this.userGroupRoleRepository.findByName('member');
            
            const groupMember = UserGroupMember.create(
                randomUUID(),
                group,
                user,
                memberRole,
                false
            );

            this.userGroupMemberRepository.store(groupMember);

            return new AcceptUserGroupRequestDto(
                group.id(),
                user.id(),
                groupMember.joinedAt(),
                {
                    name: memberRole.name(), 
                    hex_color: memberRole.hexColor(), 
                    permissions: memberRole.permissions().map((p) => {return {name: p.name()}})
                }
            );
        }
    }
}