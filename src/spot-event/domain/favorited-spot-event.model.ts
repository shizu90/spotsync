import { Model } from 'src/common/core/common.model';
import { User } from 'src/user/domain/user.model';
import { SpotEvent } from './spot-event.model';

export class FavoritedSpotEvent extends Model {
	private _id: string;
	private _user: User;
	private _spotEvent: SpotEvent;
	private _favoritedAt: Date;

	private constructor(
		id: string,
		user: User,
		spotEvent: SpotEvent,
		favoritedAt?: Date,
	) {
		super();
		this._id = id;
		this._user = user;
		this._spotEvent = spotEvent;
		this._favoritedAt = favoritedAt ?? new Date();
	}

	public static create(
		id: string,
		user: User,
		spotEvent: SpotEvent,
		favoritedAt?: Date,
	): FavoritedSpotEvent {
		return new FavoritedSpotEvent(id, user, spotEvent, favoritedAt);
	}

	public id(): string {
		return this._id;
	}

	public user(): User {
		return this._user;
	}

	public spotEvent(): SpotEvent {
		return this._spotEvent;
	}

	public favoritedAt(): Date {
		return this._favoritedAt;
	}
}
