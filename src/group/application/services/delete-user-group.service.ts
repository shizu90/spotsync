import { Inject, Injectable } from "@nestjs/common";
import { DeleteUserGroupUseCase } from "../ports/in/use-cases/delete-user-group.use-case";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { UserGroupRepository, UserGroupRepositoryProvider } from "../ports/out/user-group.repository";
import { UserGroupMemberRepository, UserGroupMemberRepositoryProvider } from "../ports/out/user-group-member.repository";
import { DeleteUserGroupCommand } from "../ports/in/commands/delete-user-group.command";
import { UserGroupNotFoundError } from "./errors/user-group-not-found.error";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-acess.error";

@Injectable()
export class DeleteUserGroupService implements DeleteUserGroupUseCase 
{
    constructor(
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
        @Inject(UserGroupRepositoryProvider)
        protected userGroupRepository: UserGroupRepository,
        @Inject(UserGroupMemberRepositoryProvider)
        protected userGroupMemberRepository: UserGroupMemberRepository
    ) 
    {}

    public async execute(command: DeleteUserGroupCommand): Promise<void> 
    {
        const authenticatedUserId = this.getAuthenticatedUser.execute(null);

        const group = await this.userGroupRepository.findById(command.userGroupId);

        if(group === null || group === undefined) {
            throw new UserGroupNotFoundError(`Group not found`);
        }

        const groupMember = (await this.userGroupMemberRepository.findBy({userGroupId: group.id(), userId: authenticatedUserId})).at(0);

        if(groupMember === null || groupMember === undefined) {
            throw new UnauthorizedAccessError(`Authenticated user is not a member of the group`);
        }

        const hasPermission = groupMember.role().permissions().map((p) => p.name()).includes('administrador') || groupMember.isCreator();

        if(!hasPermission) {
            throw new UnauthorizedAccessError(`Authenticated user don't have permission to delete the group`);
        }

        this.userGroupRepository.delete(group.id());
    }
}