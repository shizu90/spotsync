import { Repository } from 'src/common/core/common.repository';
import { Post } from 'src/post/domain/post.model';

export const PostRepositoryProvider = 'PostRepository';

export interface PostRepository extends Repository<Post, string> {}
