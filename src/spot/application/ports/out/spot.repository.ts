import { Repository } from 'src/common/core/common.repository';
import { FavoritedSpot } from 'src/spot/domain/favorited-spot.model';
import { Spot } from 'src/spot/domain/spot.model';
import { VisitedSpot } from 'src/spot/domain/visited-spot.model';

export const SpotRepositoryProvider = 'PostRepository';

export interface SpotRepository extends Repository<Spot, string> {
	findByName(name: string): Promise<Spot>;
	findVisitedSpotBy(values: Object): Promise<Array<VisitedSpot>>;
	countVisitedSpotBy(values: Object): Promise<number>;
	findFavoritedSpotBy(values: Object): Promise<Array<FavoritedSpot>>;
	countFavoritedSpotBy(values: Object): Promise<number>;
	storeFavoritedSpot(model: FavoritedSpot): Promise<FavoritedSpot>;
	storeVisitedSpot(model: VisitedSpot): Promise<VisitedSpot>;
	deleteFavoritedSpot(id: string): Promise<void>;
	deleteVisitedSpot(id: string): Promise<void>;
}
