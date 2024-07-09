import { Inject, Injectable } from "@nestjs/common";
import { AcceptUserGroupRequestUseCase } from "../ports/in/use-cases/accept-user-group-request.use-case";
import { UserGroupMemberRepository, UserGroupMemberRepositoryProvider } from "../ports/out/user-group-member.repository";
import { UserGroupRepository, UserGroupRepositoryProvider } from "../ports/out/user-group.repository";
import { AcceptUserGroupRequestCommand } from "../ports/in/commands/accept-user-group-request.command";
import { AcceptUserGroupRequestDto } from "../ports/out/dto/accept-user-group-request.dto";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { UserGroupNotFoundError } from "./errors/user-group-not-found.error";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-acess.error";
import { UserRepository, UserRepositoryProvider } from "src/user/application/ports/out/user.repository";
import { UserGroupRequestNotFoundError } from "./errors/user-group-request-not-found.error";
import { UserGroupRoleRepository, UserGroupRoleRepositoryProvider } from "../ports/out/user-group-role.repository";

@Injectable()
export class AcceptUserGroupRequestService implements AcceptUserGroupRequestUseCase 
{
    constructor(
        @Inject(UserGroupMemberRepositoryProvider)
        protected userGroupMemberRepository: UserGroupMemberRepository,
        @Inject(UserGroupRepositoryProvider)
        protected userGroupRepository: UserGroupRepository,
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
        @Inject(UserRepositoryProvider)
        protected userRepository: UserRepository,
        @Inject(UserGroupRoleRepositoryProvider)
        protected userGroupRoleRepository: UserGroupRoleRepository
    ) 
    {}

    public async execute(command: AcceptUserGroupRequestCommand): Promise<AcceptUserGroupRequestDto> 
    {
        const authenticatedUserId = this.getAuthenticatedUser.execute(null);

        const group = await this.userGroupRepository.findById(command.userGroupId);

        if(group === null || group === undefined) {
            throw new UserGroupNotFoundError(`Group not found`);
        }

        const authenticatedGroupMember = (await this.userGroupMemberRepository.findBy({userGroupId: command.userGroupId, userId: authenticatedUserId})).at(0);

        if(authenticatedGroupMember === null || authenticatedGroupMember === undefined) {
            throw new UnauthorizedAccessError(`Authenticated user is not a member of the group`);
        }

        const hasPermission = authenticatedGroupMember.role().permissions().map((p) => p.name()).includes('accept-requests');

        if(!hasPermission) {
            throw new UnauthorizedAccessError(`Authenticated user don't have permission to accept join request`);
        }

        const groupMemberRequest = await this.userGroupMemberRepository.findRequestById(command.userGroupRequestId);

        if(groupMemberRequest === null || groupMemberRequest === undefined) {
            throw new UserGroupRequestNotFoundError(`Group request not found`);
        }

        const memberRole = await this.userGroupRoleRepository.findByName('member');

        const newGroupMember = groupMemberRequest.accept(memberRole);

        await this.userGroupMemberRepository.store(newGroupMember);

        this.userGroupMemberRepository.deleteRequest(groupMemberRequest.id());

        return new AcceptUserGroupRequestDto(
            group.id(),
            newGroupMember.user().id(),
            newGroupMember.joinedAt(),
            {
                name: memberRole.name(), 
                hex_color: memberRole.hexColor(), 
                permissions: memberRole.permissions().map((p) => {return {name: p.name()}})
            }
        );
    }
}