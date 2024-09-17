import { Model } from 'src/common/core/common.model';
import { Spot } from 'src/spot/domain/spot.model';

export class SpotFolderItem extends Model {
	private _id: string;
	private _spot: Spot;
	private _orderNumber: number;
	private _addedAt: Date;

	private constructor(id: string, spot: Spot, orderNumber: number, addedAt?: Date) {
		super();
		this._id = id;
		this._spot = spot;
		this._orderNumber = orderNumber;
		this._addedAt = addedAt ?? new Date();
	}

	public static create(id: string, spot: Spot, orderNumber: number, addedAt?: Date) {
		return new SpotFolderItem(id, spot, orderNumber, addedAt);
	}

	public id(): string {
		return this._id;
	}

	public spot(): Spot {
		return this._spot;
	}

	public orderNumber(): number {
		return this._orderNumber;
	}

	public addedAt(): Date {
		return this._addedAt;
	}

	public changeOrderNumber(orderNumber: number) {
		this._orderNumber = orderNumber;
	}
}
