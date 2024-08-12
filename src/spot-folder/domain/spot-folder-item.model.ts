import { Model } from 'src/common/core/common.model';
import { Spot } from 'src/spot/domain/spot.model';

export class SpotFolderItem extends Model {
	private _id: string;
	private _spot: Spot;
	private _addedAt: Date;

	private constructor(id: string, spot: Spot, addedAt?: Date) {
		super();
		this._id = id;
		this._spot = spot;
		this._addedAt = addedAt ?? new Date();
	}

	public static create(id: string, spot: Spot, addedAt?: Date) {
		return new SpotFolderItem(id, spot, addedAt);
	}

	public id(): string {
		return this._id;
	}

	public spot(): Spot {
		return this._spot;
	}

	public addedAt(): Date {
		return this._addedAt;
	}
}
