import { Repository } from "src/common/core/common.repository";
import { FavoritedSpotFolder } from "src/spot-folder/domain/favorited-spot-folder.model";
import { SpotFolder } from "src/spot-folder/domain/spot-folder.model";

export const SpotFolderRepositoryProvider = "SpotFolderRepository";

export interface SpotFolderRepository extends Repository<SpotFolder, string> {
    findFavoritedSpotFolderBy(values: Object): Promise<Array<FavoritedSpotFolder>>;
    storeFavoritedSpotFolder(model: FavoritedSpotFolder): Promise<FavoritedSpotFolder>;
    removeFavoritedSpotFolder(id: string): Promise<void>;
}