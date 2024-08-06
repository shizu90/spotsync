import { Repository } from 'src/common/core/common.repository';
import { Spot } from 'src/spot/domain/spot.model';

export const SpotRepositoryProvider = 'PostRepository';

export interface SpotRepository extends Repository<Spot, string> {
	findByName(name: string): Promise<Spot>;
}
