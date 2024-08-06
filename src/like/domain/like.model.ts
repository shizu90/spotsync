import { Model } from 'src/common/core/common.model';
import { User } from 'src/user/domain/user.model';
import { LikableSubject } from './likable-subject.enum';

export class Like extends Model {
	private _id: string;
	private _likableSubject: LikableSubject;
	private _likableSubjectId: string;
	private _user: User;
	private _createdAt: Date;

	private constructor(
		id: string,
		likableSubject: LikableSubject,
		likableSubjectId: string,
		user: User,
		createdAt?: Date,
	) {
		super();

		this._id = id;
		this._likableSubject = likableSubject;
		this._likableSubjectId = likableSubjectId;
		this._user = user;
		this._createdAt = createdAt ?? new Date();
	}

	public static create(
		id: string,
		likableSubject: LikableSubject,
		likableSubjectId: string,
		user: User,
		createdAt?: Date,
	): Like {
		return new Like(id, likableSubject, likableSubjectId, user, createdAt);
	}

	public id(): string {
		return this._id;
	}

	public likableSubject(): LikableSubject {
		return this._likableSubject;
	}

	public likableSubjectId(): string {
		return this._likableSubjectId;
	}

	public user(): User {
		return this._user;
	}

	public createdAt(): Date {
		return this._createdAt;
	}
}
