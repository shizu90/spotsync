import { Model } from 'src/common/core/common.model';
import { Spot } from 'src/spot/domain/spot.model';

export class SpotFolderItem extends Model {
	private _spot: Spot;
	private _orderNumber: number;
	private _addedAt: Date;

	private constructor(spot: Spot, orderNumber: number, addedAt?: Date) {
		super();
		this._spot = spot;
		this._orderNumber = orderNumber;
		this._addedAt = addedAt ?? new Date();
	}

	public static create(spot: Spot, orderNumber: number, addedAt?: Date) {
		return new SpotFolderItem(spot, orderNumber, addedAt);
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
