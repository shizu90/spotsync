import { UseCase } from "src/common/core/common.use-case";
import { UpdateRatingCommand } from "../commands/update-rating.command";

export const UpdateRatingUseCaseProvider = "UpdateRatingUseCase";

export interface UpdateRatingUseCase extends UseCase<UpdateRatingCommand, Promise<void>> {}