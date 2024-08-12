import { Model } from 'src/common/core/common.model';
import { User } from 'src/user/domain/user.model';

export class SpotEventParticipant extends Model {
	private _id: string;
	private _user: User;
	private _participationDate: Date;

	private constructor(id: string, user: User, participationDate?: Date) {
		super();
		this._id = id;
		this._user = user;
		this._participationDate = participationDate ?? new Date();
	}

	public static create(
		id: string,
		user: User,
		participationDate?: Date,
	): SpotEventParticipant {
		return new SpotEventParticipant(id, user, participationDate);
	}

	public id(): string {
		return this._id;
	}

	public user(): User {
		return this._user;
	}

	public participationDate(): Date {
		return this._participationDate;
	}
}
