import { Repository } from 'src/common/common.repository';
import { Like } from 'src/like/domain/like.model';

export const LikeRepositoryProvider = 'LikeRepository';

export interface LikeRepository extends Repository<Like, string> {}
