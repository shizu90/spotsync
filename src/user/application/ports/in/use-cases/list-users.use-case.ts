import { UseCase } from "src/common/common.use-case";
import { ListUsersCommand } from "../commands/list-users.command";
import { Pagination } from "src/common/pagination.dto";
import { GetUserProfileDto } from "../../out/dto/get-user-profile.dto";

export const ListUsersUseCaseProvider = "ListUsersUseCase";

export interface ListUsersUseCase extends UseCase<ListUsersCommand, Promise<Array<GetUserProfileDto> | Pagination<GetUserProfileDto>>> 
{}