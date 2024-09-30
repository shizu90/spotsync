import { User } from 'src/user/domain/user.model';
import { Comment } from './comment.model';

export interface Commentable {
	id(): string;
	comment(user: User, text: string): Comment;
}
