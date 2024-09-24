import { UseCase } from "src/common/core/common.use-case";
import { FavoriteSpotFolderCommand } from "../commands/favorite-spot-folder.command";

export const FavoriteSpotFolderUseCaseProvider = "FavoriteSpotFolderUseCase";

export interface FavoriteSpotFolderUseCase extends UseCase<FavoriteSpotFolderCommand, Promise<void>> {}