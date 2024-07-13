import { Inject, Injectable } from "@nestjs/common";
import { ListGroupMembersUseCase } from "../ports/in/use-cases/list-group-members.use-case";
import { GroupMemberRepository, GroupMemberRepositoryProvider } from "../ports/out/group-member.repository";
import { ListGroupMembersCommand } from "../ports/in/commands/list-group-members.command";
import { Pagination } from "src/common/pagination.dto";
import { GetGroupMemberDto } from "../ports/out/dto/get-group-member.dto";
import { GroupRepository, GroupRepositoryProvider } from "../ports/out/group.repository";
import { GroupNotFoundError } from "./errors/group-not-found.error";

@Injectable()
export class ListGroupMembersService implements ListGroupMembersUseCase 
{
    constructor(
        @Inject(GroupMemberRepositoryProvider)
        protected groupMemberRepository: GroupMemberRepository,
        @Inject(GroupRepositoryProvider)
        protected groupRepository: GroupRepository
    ) 
    {}

    public async execute(command: ListGroupMembersCommand): Promise<Array<GetGroupMemberDto> | Pagination<GetGroupMemberDto>> 
    {
        const group = await this.groupRepository.findById(command.groupId);

        if(group === null || group === undefined || group.isDeleted()) {
            throw new GroupNotFoundError(`Group not found`);
        }

        if(group.visibilityConfiguration().groupVisibility() === 'PRIVATE') {
            if(command.paginate) {
                return new Pagination(
                    [],
                    0
                );
            }else {
                return [];
            }
        }else {
            const groupMembers = await this.groupMemberRepository.findBy({
                groupId: command.groupId,
                name: command.name,
                roleId: command.roleId,
                sort: command.sort,
                sortDirection: command.sortDirection,
                paginate: command.paginate,
                page: command.page,
                limit: command.limit
            });

            const items = groupMembers.map((gm) => {
                return new GetGroupMemberDto(
                    gm.id(),
                    gm.user().id(),
                    gm.group().id(),
                    {
                        id: gm.role().id(), 
                        name: gm.role().name(), 
                        hex_color: gm.role().hexColor(),
                        permissions: gm.role().permissions().map((p) => {return {id: p.id(), name: p.name()};})
                    },
                    gm.joinedAt(),
                    gm.isCreator()
                );
            });

            if(command.paginate) {
                return new Pagination(items, items.length);
            }else {
                return items;
            }
        }
    }
}