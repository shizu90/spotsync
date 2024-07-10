import { UseCase } from "src/common/common.use-case";
import { ListUserGroupsCommand } from "../commands/list-user-groups.command";
import { Pagination } from "src/common/pagination.dto";
import { GetUserGroupDto } from "../../out/dto/get-user-group.dto";

export const ListUserGroupsUseCaseProvider = "ListUserGroupsUseCase";

export interface ListUserGroupsUseCase extends UseCase<ListUserGroupsCommand, Promise<Pagination<GetUserGroupDto>>> 
{}