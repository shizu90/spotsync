import { Model } from 'src/common/core/common.model';
import { User } from 'src/user/domain/user.model';
import { Spot } from './spot.model';

export class FavoritedSpot extends Model {
	private _id: string;
	private _spot: Spot;
	private _user: User;
	private _favoritedAt: Date;

	private constructor(
		id: string,
		spot: Spot,
		user: User,
		favoritedAt?: Date,
	) {
		super();
		this._id = id;
		this._spot = spot;
		this._user = user;
		this._favoritedAt = favoritedAt ?? new Date();
	}

	public static create(
		id: string,
		spot: Spot,
		user: User,
		favoritedAt?: Date,
	) {
		return new FavoritedSpot(id, spot, user, favoritedAt);
	}

	public id(): string {
		return this._id;
	}

	public spot(): Spot {
		return this._spot;
	}

	public user(): User {
		return this._user;
	}

	public favoritedAt(): Date {
		return this._favoritedAt;
	}
}
