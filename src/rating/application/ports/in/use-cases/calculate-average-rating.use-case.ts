import { UseCase } from "src/common/core/common.use-case";
import { CalculateAverageRatingCommand } from "../commands/calculate-average-rating.command";

export const CalculateAverageRatingUseCaseProvider = "CalculateAverageRatingUseCase";

export interface CalculateAverageRatingUseCase extends UseCase<CalculateAverageRatingCommand, Promise<number>> {}