import { UseCase } from "src/common/core/common.use-case";
import { DeleteRatingCommand } from "../commands/delete-rating.command";

export const DeleteRatingUseCaseProvider = "DeleteRatingUseCase";

export interface DeleteRatingUseCase extends UseCase<DeleteRatingCommand, Promise<void>> {}