import { Repository } from 'src/common/core/common.repository';
import { Spot } from 'src/spot/domain/spot.model';
import { VisitedSpot } from 'src/spot/domain/visited-spot.model';

export const SpotRepositoryProvider = 'PostRepository';

export interface SpotRepository extends Repository<Spot, string> {
	findByName(name: string): Promise<Spot>;
	findVisitedSpotBy(values: Object): Promise<Array<VisitedSpot>>;
	countVisitedSpotBy(values: Object): Promise<number>;
	storeVisitedSpot(model: VisitedSpot): Promise<VisitedSpot>;
	deleteVisitedSpot(id: string): Promise<void>;
}
