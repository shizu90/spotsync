import { Repository } from "src/common/core/common.repository";
import { Favorite } from "src/favorite/domain/favorite.model";

export const FavoriteRepositoryProvider = "FavoriteRepository";

export interface FavoriteRepository extends Repository<Favorite, string> {}