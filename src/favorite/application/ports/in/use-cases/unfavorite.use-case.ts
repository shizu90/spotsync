import { UseCase } from "src/common/core/common.use-case";
import { UnfavoriteCommand } from "../commands/unfavorite.command";

export const UnfavoriteUseCaseProvider = "UnfavoriteUseCase";

export interface UnfavoriteUseCase extends UseCase<UnfavoriteCommand, Promise<void>> {}