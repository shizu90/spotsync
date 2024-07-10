import { Inject, Injectable } from "@nestjs/common";
import { JoinGroupUseCase } from "../ports/in/use-cases/join-group.use-case";
import { UserRepository, UserRepositoryProvider } from "src/user/application/ports/out/user.repository";
import { GroupRepository, GroupRepositoryProvider } from "../ports/out/group.repository";
import { GroupMemberRepository, GroupMemberRepositoryProvider } from "../ports/out/group-member.repository";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { JoinGroupCommand } from "../ports/in/commands/join-group.command";
import { JoinGroupDto } from "../ports/out/dto/join-group.dto";
import { AcceptGroupRequestDto } from "../ports/out/dto/accept-group-request.dto";
import { UserNotFoundError } from "src/user/application/services/errors/user-not-found.error";
import { GroupVisibility } from "src/group/domain/group-visibility.enum";
import { GroupMemberRequest } from "src/group/domain/group-member-request.model";
import { randomUUID } from "crypto";
import { GroupMember } from "src/group/domain/group-member.model";
import { GroupRoleRepository, GroupRoleRepositoryProvider } from "../ports/out/group-role.repository";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-acess.error";

@Injectable()
export class JoinGroupService implements JoinGroupUseCase 
{
    constructor(
        @Inject(UserRepositoryProvider)
        protected userRepository: UserRepository,
        @Inject(GroupRepositoryProvider)
        protected groupRepository: GroupRepository,
        @Inject(GroupMemberRepositoryProvider)
        protected groupMemberRepository: GroupMemberRepository,
        @Inject(GroupRoleRepositoryProvider)
        protected groupRoleRepository: GroupRoleRepository,
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase
    ) 
    {}

    public async execute(command: JoinGroupCommand): Promise<JoinGroupDto | AcceptGroupRequestDto> 
    {
        const authenticatedUserId = this.getAuthenticatedUser.execute(null);

        const user = await this.userRepository.findById(authenticatedUserId);

        if(user === null || user === undefined || user.isDeleted()) {
            throw new UserNotFoundError(`User not found`);
        }

        const group = await this.groupRepository.findById(command.id);

        if(group.visibilityConfiguration().groupVisibility() === GroupVisibility.PRIVATE) {
            const groupMemberRequest = GroupMemberRequest.create(
                randomUUID(),
                group,
                user
            );

            this.groupMemberRepository.storeRequest(groupMemberRequest);

            return new JoinGroupDto(
                groupMemberRequest.id(),
                group.id(),
                user.id()
            );
        }else {
            const memberRole = await this.groupRoleRepository.findByName('member');
            
            const groupMember = GroupMember.create(
                randomUUID(),
                group,
                user,
                memberRole,
                false
            );

            this.groupMemberRepository.store(groupMember);

            return new AcceptGroupRequestDto(
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