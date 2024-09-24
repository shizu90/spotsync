import { UseCase } from "src/common/core/common.use-case";
import { FavoriteDto } from "../../out/dto/favorite.dto";
import { FavoriteCommand } from "../commands/favorite.command";

export const FavoriteUseCaseProvider = "FavoriteUseCase";

export interface FavoriteUseCase extends UseCase<FavoriteCommand, Promise<FavoriteDto>> {}