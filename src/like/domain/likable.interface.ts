import { User } from 'src/user/domain/user.model';
import { Like } from './like.model';

export interface Likable {
	id(): string;
	like(user: User): Like;
}
