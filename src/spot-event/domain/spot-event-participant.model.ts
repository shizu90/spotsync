import { Model } from 'src/common/core/common.model';
import { User } from 'src/user/domain/user.model';

export class SpotEventParticipant extends Model {
	private _user: User;
	private _participatedAt: Date;

	private constructor(user: User, participatedAt?: Date) {
		super();
		this._user = user;
		this._participatedAt = participatedAt ?? new Date();
	}

	public static create(
		user: User,
		participatedAt?: Date,
	): SpotEventParticipant {
		return new SpotEventParticipant(user, participatedAt);
	}

	public user(): User {
		return this._user;
	}

	public participatedAt(): Date {
		return this._participatedAt;
	}
}
