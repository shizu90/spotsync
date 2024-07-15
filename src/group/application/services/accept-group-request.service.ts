import { Inject, Injectable } from "@nestjs/common";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { GroupNotFoundError } from "./errors/group-not-found.error";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-access.error";
import { UserRepository, UserRepositoryProvider } from "src/user/application/ports/out/user.repository";
import { GroupRequestNotFoundError } from "./errors/group-request-not-found.error";
import { AcceptGroupRequestUseCase } from "../ports/in/use-cases/accept-group-request.use-case";
import { GroupMemberRepository, GroupMemberRepositoryProvider } from "../ports/out/group-member.repository";
import { GroupRepository, GroupRepositoryProvider } from "../ports/out/group.repository";
import { GroupRoleRepository, GroupRoleRepositoryProvider } from "../ports/out/group-role.repository";
import { AcceptGroupRequestCommand } from "../ports/in/commands/accept-group-request.command";
import { AcceptGroupRequestDto } from "../ports/out/dto/accept-group-request.dto";

@Injectable()
export class AcceptGroupRequestService implements AcceptGroupRequestUseCase
{
    constructor(
        @Inject(GroupMemberRepositoryProvider)
        protected groupMemberRepository: GroupMemberRepository,
        @Inject(GroupRepositoryProvider)
        protected groupRepository: GroupRepository,
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
        @Inject(UserRepositoryProvider)
        protected userRepository: UserRepository,
        @Inject(GroupRoleRepositoryProvider)
        protected groupRoleRepository: GroupRoleRepository
    ) 
    {}

    public async execute(command: AcceptGroupRequestCommand): Promise<AcceptGroupRequestDto> 
    {
        const authenticatedUserId = this.getAuthenticatedUser.execute(null);

        const group = await this.groupRepository.findById(command.groupId);

        if(group === null || group === undefined || group.isDeleted()) {
            throw new GroupNotFoundError(`Group not found`);
        }

        const authenticatedGroupMember = (await this.groupMemberRepository.findBy({GroupId: command.id, userId: authenticatedUserId})).at(0);

        if(authenticatedGroupMember === null || authenticatedGroupMember === undefined) {
            throw new UnauthorizedAccessError(`You are not a member of the group`);
        }

        const hasPermission = authenticatedGroupMember.role().permissions().map((p) => p.name()).includes('accept-requests');

        if(!(hasPermission || authenticatedGroupMember.isCreator() || authenticatedGroupMember.role().name() === 'administrator')) {
            throw new UnauthorizedAccessError(`You don't have permission to accept join requests`);
        }

        const groupMemberRequest = await this.groupMemberRepository.findRequestById(command.id);

        if(groupMemberRequest === null || groupMemberRequest === undefined) {
            throw new GroupRequestNotFoundError(`Group request not found`);
        }

        const memberRole = await this.groupRoleRepository.findByName('member');

        const newGroupMember = groupMemberRequest.accept(memberRole);

        await this.groupMemberRepository.store(newGroupMember);

        this.groupMemberRepository.deleteRequest(groupMemberRequest.id());

        return new AcceptGroupRequestDto(
            group.id(),
            {
                id: newGroupMember.user().id(),
                profile_picture: newGroupMember.user().profilePicture(),
                banner_picture: newGroupMember.user().bannerPicture(),
                credentials: {name: newGroupMember.user().credentials().name()}
            },
            newGroupMember.joinedAt(),
            {
                name: memberRole.name(), 
                hex_color: memberRole.hexColor(), 
                permissions: memberRole.permissions().map((p) => {return {id: p.id(), name: p.name()}})
            }
        );
    }
}