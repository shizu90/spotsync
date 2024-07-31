import { Pagination } from "src/common/common.repository";
import { UseCase } from "src/common/common.use-case";
import { GetLikeDto } from "../../out/dto/get-like.dto";
import { ListLikesCommand } from "../commands/list-likes.command";

export const ListLikesUseCaseProvider = "ListLikesUseCase";

export interface ListLikesUseCase extends UseCase<ListLikesCommand, Promise<Pagination<GetLikeDto>>> 
{}