import { Comment } from 'src/comment/domain/comment.model';
import { Repository } from 'src/common/core/common.repository';

export const CommentRepositoryProvider = 'CommentRepository';

export interface CommentRepository extends Repository<Comment, string> {}
