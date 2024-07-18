import { Inject, Injectable } from "@nestjs/common";
import { ListGroupRolesUseCase } from "../ports/in/use-cases/list-group-roles.use-case";
import { GroupRepository, GroupRepositoryProvider } from "../ports/out/group.repository";
import { GroupRoleRepository, GroupRoleRepositoryProvider } from "../ports/out/group-role.repository";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { ListGroupRolesCommand } from "../ports/in/commands/list-group-roles.command";
import { GetGroupRoleDto } from "../ports/out/dto/get-group-role.dto";
import { GroupNotFoundError } from "./errors/group-not-found.error";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-access.error";
import { GroupMemberRepository, GroupMemberRepositoryProvider } from "../ports/out/group-member.repository";
import { Pagination } from "src/common/common.repository";

@Injectable()
export class ListGroupRolesService implements ListGroupRolesUseCase 
{
    constructor(
        @Inject(GroupRepositoryProvider)
        protected groupRepository: GroupRepository,
        @Inject(GroupRoleRepositoryProvider)
        protected groupRoleRepository: GroupRoleRepository,
        @Inject(GroupMemberRepositoryProvider)
        protected groupMemberRepository: GroupMemberRepository,
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase
    ) 
    {}

    public async execute(command: ListGroupRolesCommand): Promise<Pagination<GetGroupRoleDto>> 
    {
        const authenticatedUserId = this.getAuthenticatedUser.execute(null);

        const group = await this.groupRepository.findById(command.groupId);

        if(group === null || group === undefined || group.isDeleted()) {
            throw new GroupNotFoundError(`Group not found`);
        }

        const authenticatedGroupMember = (await this.groupMemberRepository.findBy({groupId: group.id(), userId: authenticatedUserId})).at(0);

        if(authenticatedGroupMember === null || authenticatedGroupMember === undefined) {
            throw new UnauthorizedAccessError(`You're not a member of the group`);
        }

        const pagination = await this.groupRoleRepository.paginate({
            filters: {
                groupId: command.groupId,
                isImmutable: command.isImmutable,
                name: command.name
            },
            sort: command.sort,
            sortDirection: command.sortDirection,
            paginate: command.paginate,
            page: command.page,
            limit: command.limit
        });

        const items = pagination.items.map((gr) => {
            return new GetGroupRoleDto(
                gr.id(),
                gr.group() ? gr.group().id() : null,
                gr.name(),
                gr.isImmutable(),
                gr.hexColor(),
                gr.permissions().map((p) => {return {id: p.id(), name: p.name()};}),
                gr.createdAt(),
                gr.updatedAt()
            );
        });

        return new Pagination(items, pagination.total, pagination.current_page);
    }
}