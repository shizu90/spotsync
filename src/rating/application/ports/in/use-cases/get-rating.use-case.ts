import { UseCase } from "src/common/core/common.use-case";
import { RatingDto } from "../../out/dto/rating.dto";
import { GetRatingCommand } from "../commands/get-rating.command";

export const GetRatingUseCaseProvider = "GetRatingUseCase";

export interface GetRatingUseCase extends UseCase<GetRatingCommand, Promise<RatingDto>> {}