import { Model } from 'src/common/core/common.model';
import { User } from 'src/user/domain/user.model';
import { Spot } from './spot.model';

export class VisitedSpot extends Model {
	private _id: string;
	private _spot: Spot;
	private _user: User;
	private _visitedAt: Date;

	private constructor(id: string, spot: Spot, user: User, visitedAt?: Date) {
		super();
		this._id = id;
		this._spot = spot;
		this._user = user;
		this._visitedAt = visitedAt ?? new Date();
	}

	public static create(id: string, spot: Spot, user: User, visitedAt?: Date) {
		return new VisitedSpot(id, spot, user, visitedAt);
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

	public visitedAt(): Date {
		return this._visitedAt;
	}
}
