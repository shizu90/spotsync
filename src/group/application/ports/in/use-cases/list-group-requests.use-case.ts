import { UseCase } from "src/common/common.use-case";
import { ListGroupRequestsCommand } from "../commands/list-group-requests.command";
import { Pagination } from "src/common/pagination.dto";
import { GetGroupRequestDto } from "../../out/dto/get-group-request.dto";

export const ListGroupRequestsUseCaseProvider = "ListGroupRequestsUseCase";

export interface ListGroupRequestsUseCase extends UseCase<ListGroupRequestsCommand, Promise<Array<GetGroupRequestDto> | Pagination<GetGroupRequestDto>>> 
{}