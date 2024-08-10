import { Repository } from 'src/common/core/common.repository';
import { FavoritedSpot } from 'src/spot/domain/favorited-spot.model';
import { Spot } from 'src/spot/domain/spot.model';
import { VisitedSpot } from 'src/spot/domain/visited-spot.model';

export const SpotRepositoryProvider = 'PostRepository';

export interface SpotRepository extends Repository<Spot, string> {
	findByName(name: string): Promise<Spot>;
	countVisitedSpotsBy(values: Object): Promise<number>;
	countFavoritedSpotsBy(values: Object): Promise<number>;
	findVisitedSpotBy(values: Object): Promise<Array<VisitedSpot>>;
	findFavoritedSpotBy(values: Object): Promise<Array<FavoritedSpot>>;
	createFavoritedSpot(model: FavoritedSpot): Promise<FavoritedSpot>;
	createVisitedSpot(model: VisitedSpot): Promise<VisitedSpot>;
	deleteFavoritedSpot(id: string): Promise<void>;
	deleteVisitedSpot(id: string): Promise<void>;
}
