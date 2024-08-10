import { UseCase } from "src/common/core/common.use-case";
import { UnfavoriteSpotCommand } from "../commands/unfavorite-spot.command";

export const UnfavoriteSpotUseCaseProvider = "UnfavoriteSpotUseCase";

export interface UnfavoriteSpotUseCase extends UseCase<UnfavoriteSpotCommand, Promise<void>> {}