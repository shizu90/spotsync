import { UseCase } from "src/common/common.use-case";
import { ListUsersCommand } from "../commands/list-users.command";
import { GetUserProfileDto } from "../../out/dto/get-user-profile.dto";
import { Pagination } from "src/common/common.repository";

export const ListUsersUseCaseProvider = "ListUsersUseCase";

export interface ListUsersUseCase extends UseCase<ListUsersCommand, Promise<Pagination<GetUserProfileDto>>> 
{}