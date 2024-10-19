import { UseCase } from "src/common/core/common.use-case";
import { RatingDto } from "../../out/dto/rating.dto";
import { CreateRatingCommand } from "../commands/create-rating.command";

export const CreateRatingUseCaseProvider = "CreateRatingUseCase";

export interface CreateRatingUseCase extends UseCase<CreateRatingCommand, Promise<RatingDto>> {}