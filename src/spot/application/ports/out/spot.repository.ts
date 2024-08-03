import { Repository } from "src/common/common.repository";
import { Spot } from "src/spot/domain/spot.model";

export const SpotRepositoryProvider = "PostRepository";

export interface SpotRepository extends Repository<Spot, string> {}