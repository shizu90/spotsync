import { UseCase } from "src/common/common.use-case";
import { Pagination } from "src/common/pagination.dto";
import { ListGroupsCommand } from "../commands/list-groups.command";
import { GetGroupDto } from "../../out/dto/get-group.dto";

export const ListGroupsUseCaseProvider = "ListGroupsUseCase";

export interface ListGroupsUseCase extends UseCase<ListGroupsCommand, Promise<Pagination<GetGroupDto>>> 
{}