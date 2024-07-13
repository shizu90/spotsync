import { UseCase } from "src/common/common.use-case";
import { ListGroupMembersCommand } from "../commands/list-group-members.command";
import { Pagination } from "src/common/pagination.dto";
import { GetGroupMemberDto } from "../../out/dto/get-group-member.dto";

export const ListGroupMembersUseCaseProvider = "ListGroupMembersUseCase";

export interface ListGroupMembersUseCase extends UseCase<ListGroupMembersCommand, Promise<Array<GetGroupMemberDto> | Pagination<GetGroupMemberDto>>> 
{}