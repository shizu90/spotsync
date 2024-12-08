import { PaginateParameters, Pagination, Repository } from 'src/common/core/common.repository';
import { Post } from 'src/post/domain/post.model';

export const PostRepositoryProvider = 'PostRepository';

export interface PostRepository extends Repository<Post, string> {
    paginateAuthorizedPosts(userId: string, params: PaginateParameters): Promise<Pagination<Post>>;
    findAuthorizedPostById(userId: string, postId: string): Promise<Post>;
}
