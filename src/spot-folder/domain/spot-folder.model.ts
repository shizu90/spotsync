import { randomUUID } from 'crypto';
import { Model } from 'src/common/core/common.model';
import { Favoritable } from 'src/favorite/domain/favoritable.interface';
import { Favorite } from 'src/favorite/domain/favorite.model';
import { Spot } from 'src/spot/domain/spot.model';
import { User } from 'src/user/domain/user.model';
import { SpotFolderItem } from './spot-folder-item.model';
import { SpotFolderVisibility } from './spot-folder-visibility.enum';

export class SpotFolder extends Model implements Favoritable {
	private _id: string;
	private _name: string;
	private _description: string;
	private _hexColor: string;
	private _visibility: SpotFolderVisibility;
	private _items: SpotFolderItem[];
	private _creator: User;
	private _createdAt: Date;
	private _updatedAt: Date;

	private constructor(
		id: string,
		name: string,
		description: string,
		hexColor: string,
		visibility: SpotFolderVisibility,
		creator: User,
		items?: SpotFolderItem[],
		createdAt?: Date,
		updatedAt?: Date,
	) {
		super();
		this._id = id;
		this._name = name;
		this._description = description;
		this._hexColor = hexColor;
		this._visibility = visibility;
		this._creator = creator;
		this._items = items ?? [];
		this._createdAt = createdAt ?? new Date();
		this._updatedAt = updatedAt ?? new Date();
	}

	public static create(
		id: string,
		name: string,
		description: string,
		hexColor: string,
		visibility: SpotFolderVisibility,
		creator: User,
		items?: SpotFolderItem[],
		createdAt?: Date,
		updatedAt?: Date,
	): SpotFolder {
		return new SpotFolder(
			id,
			name,
			description,
			hexColor,
			visibility,
			creator,
			items,
			createdAt,
			updatedAt,
		);
	}

	public id(): string {
		return this._id;
	}

	public name(): string {
		return this._name;
	}

	public description(): string {
		return this._description;
	}

	public hexColor(): string {
		return this._hexColor;
	}

	public visibility(): SpotFolderVisibility {
		return this._visibility;
	}

	public creator(): User {
		return this._creator;
	}

	public items(): SpotFolderItem[] {
		return this._items;
	}

	public createdAt(): Date {
		return this._createdAt;
	}

	public updatedAt(): Date {
		return this._updatedAt;
	}

	public changeName(name: string): void {
		this._name = name;
		this._updatedAt = new Date();
	}

	public changeDescription(description: string): void {
		this._description = description;
		this._updatedAt = new Date();
	}

	public changeHexColor(hexColor: string): void {
		this._hexColor = hexColor;
		this._updatedAt = new Date();
	}

	public changeVisibility(visibility: SpotFolderVisibility): void {
		this._visibility = visibility;
		this._updatedAt = new Date();
	}

	public findItemBySpotId(id: string): SpotFolderItem {
		return this._items.find((item) => item.spot().id() === id);
	}

	public findItem(spot: Spot): SpotFolderItem {
		return this._items.find((item) => item.spot().id() === spot.id());
	}

	public addItem(spot: Spot): SpotFolderItem {
		const exists = this._items.some(
			(item) => item.spot().id() === spot.id(),
		);

		if (!exists) {
			const item = SpotFolderItem.create(spot, this._items.length + 1);

			this._items.push(item);
			this._updatedAt = new Date();

			return item;
		}

		return null;
	}

	public removeItemBySpotId(id: string): void {
		const idx = this._items.findIndex((item) => item.spot().id() === id);
		this._items.splice(idx, 1);
		this._updatedAt = new Date();
	}

	public removeItem(spot: Spot): void {
		const idx = this._items.findIndex(
			(item) => item.spot().id() === spot.id(),
		);
		this._items.splice(idx, 1);
		this._updatedAt = new Date();
	}

	public favorite(user: User): Favorite {
		return Favorite.createForSpotFolder(randomUUID(), user, this);
	}

	public sortItems(): void {
		this._items = this._items.sort((a, b) => a.orderNumber() - b.orderNumber());
	}
}
