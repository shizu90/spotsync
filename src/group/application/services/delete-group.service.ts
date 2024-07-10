import { Inject, Injectable } from "@nestjs/common";
import { DeleteGroupUseCase } from "../ports/in/use-cases/delete-group.use-case";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { GroupRepository, GroupRepositoryProvider } from "../ports/out/group.repository";
import { GroupMemberRepository, GroupMemberRepositoryProvider } from "../ports/out/group-member.repository";
import { DeleteGroupCommand } from "../ports/in/commands/delete-group.command";
import { GroupNotFoundError } from "./errors/group-not-found.error";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-acess.error";

@Injectable()
export class DeleteGroupService implements DeleteGroupUseCase 
{
    constructor(
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
        @Inject(GroupRepositoryProvider)
        protected groupRepository: GroupRepository,
        @Inject(GroupMemberRepositoryProvider)
        protected groupMemberRepository: GroupMemberRepository
    ) 
    {}

    public async execute(command: DeleteGroupCommand): Promise<void> 
    {
        const authenticatedUserId = this.getAuthenticatedUser.execute(null);

        const group = await this.groupRepository.findById(command.id);

        if(group === null || group === undefined) {
            throw new GroupNotFoundError(`Group not found`);
        }

        const groupMember = (await this.groupMemberRepository.findBy({groupId: group.id(), userId: authenticatedUserId})).at(0);

        if(groupMember === null || groupMember === undefined) {
            throw new UnauthorizedAccessError(`Authenticated user is not a member of the group`);
        }

        const hasPermission = groupMember.role().permissions().map((p) => p.name()).includes('administrador') || groupMember.isCreator();

        if(!hasPermission) {
            throw new UnauthorizedAccessError(`Authenticated user don't have permission to delete the group`);
        }

        this.groupRepository.delete(group.id());
    }
}