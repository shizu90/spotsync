import { UseCase } from "src/common/core/common.use-case";
import { UnfavoriteSpotFolderCommand } from "../commands/unfavorite-spot-folder.command";

export const UnfavoriteSpotFolderUseCaseProvider = "UnfavoriteSpotFolderUseCase";

export interface UnfavoriteSpotFolderUseCase extends UseCase<UnfavoriteSpotFolderCommand, Promise<void>> {}