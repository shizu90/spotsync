import { Repository } from 'src/common/core/common.repository';
import { PostThread } from 'src/post/domain/post-thread.model';

export const PostThreadRepositoryProvider = 'PostThreadRepository';

export interface PostThreadRepository extends Repository<PostThread, string> {}
