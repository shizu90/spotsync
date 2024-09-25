import { Model } from 'src/common/core/common.model';
import { Post } from 'src/post/domain/post.model';
import { User } from 'src/user/domain/user.model';
import { LikableSubject } from './likable-subject.enum';
import { Likable } from './likable.interface';

export class Like extends Model {
	private _id: string;
	private _likableSubject: LikableSubject;
	private _likable: Likable;
	private _user: User;
	private _createdAt: Date;

	private constructor(
		id: string,
		likableSubject: LikableSubject,
		likable: Likable,
		user: User,
		createdAt?: Date,
	) {
		super();

		this._id = id;
		this._likableSubject = likableSubject;
		this._likable = likable;
		this._user = user;
		this._createdAt = createdAt ?? new Date();
	}

	public static create(
		id: string,
		likableSubject: LikableSubject,
		likable: Likable,
		user: User,
		createdAt?: Date,
	): Like {
		return new Like(id, likableSubject, likable, user, createdAt);
	}

	public static createForPost(
		id: string,
		spot: Post,
		user: User,
		createdAt?: Date,
	) {
		return new Like(id, LikableSubject.POST, spot, user, createdAt);
	}

	public id(): string {
		return this._id;
	}

	public likableSubject(): LikableSubject {
		return this._likableSubject;
	}

	public likable(): Likable {
		return this._likable;
	}

	public user(): User {
		return this._user;
	}

	public createdAt(): Date {
		return this._createdAt;
	}
}
