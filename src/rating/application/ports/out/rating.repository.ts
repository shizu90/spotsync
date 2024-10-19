import { Repository } from "src/common/core/common.repository";
import { Rating } from "src/rating/domain/rating.model";

export const RatingRepositoryProvider = "RatingRepository";

export interface RatingRepository extends Repository<Rating, string> {}