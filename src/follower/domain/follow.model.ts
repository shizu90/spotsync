import { Model } from 'src/common/core/common.model';
import { User } from 'src/user/domain/user.model';
import { FollowStatus } from './follow-status.enum';

export class Follow extends Model {
	private _id: string;
	private _from: User;
	private _to: User;
	private _status: FollowStatus;
	private _followedAt: Date;

	private constructor(id: string, from: User, to: User, status?: FollowStatus, followedAt?: Date) {
		super();
		this._id = id;
		this._from = from;
		this._to = to;
		this._status = status;
		this._followedAt = followedAt ?? new Date();
	}

	public static create(
		id: string,
		from: User,
		to: User,
		status?: FollowStatus,
		followedAt?: Date,
	): Follow {
		return new Follow(id, from, to, status, followedAt);
	}

	public id(): string {
		return this._id;
	}

	public from(): User {
		return this._from;
	}

	public to(): User {
		return this._to;
	}

	public status(): FollowStatus {
		return this._status;
	}

	public followedAt(): Date {
		return this._followedAt;
	}
}
