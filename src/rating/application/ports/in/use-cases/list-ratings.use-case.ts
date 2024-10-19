import { Pagination } from "src/common/core/common.repository";
import { UseCase } from "src/common/core/common.use-case";
import { RatingDto } from "../../out/dto/rating.dto";
import { ListRatingsCommand } from "../commands/list-ratings.command";

export const ListRatingsUseCaseProvider = "ListRatingsUseCase";

export interface ListRatingsUseCase extends UseCase<ListRatingsCommand, Promise<Array<RatingDto> | Pagination<RatingDto>>> {}