import { randomUUID } from 'crypto';
import { Comment } from 'src/comment/domain/comment.model';
import { CommentableSubject } from 'src/comment/domain/commentable-subject.enum';
import { Commentable } from 'src/comment/domain/commentable.interface';
import { Model } from 'src/common/core/common.model';
import { Favoritable } from 'src/favorite/domain/favoritable.interface';
import { Favorite } from 'src/favorite/domain/favorite.model';
import { RatableSubject } from 'src/rating/domain/ratable-subject.enum';
import { Ratable } from 'src/rating/domain/ratable.interface';
import { Rating } from 'src/rating/domain/rating.model';
import { User } from 'src/user/domain/user.model';
import { SpotAddress } from './spot-address.model';
import { SpotAttachment } from './spot-attachment.model';
import { SpotType } from './spot-type.enum';
import { VisitedSpot } from './visited-spot.model';

export class Spot extends Model implements Favoritable, Commentable, Ratable {
	private _id: string;
	private _name: string;
	private _description: string;
	private _type: SpotType;
	private _address: SpotAddress;
	private _attachments: SpotAttachment[];
	private _creator: User;
	private _createdAt: Date;
	private _updatedAt: Date;
	private _isDeleted: boolean;

	private constructor(
		id: string,
		name: string,
		description: string,
		type: SpotType,
		address: SpotAddress,
		attachments: SpotAttachment[],
		creator: User,
		createdAt?: Date,
		updatedAt?: Date,
		isDeleted?: boolean,
	) {
		super();
		this._id = id;
		this._name = name;
		this._description = description;
		this._type = type;
		this._address = address;
		this._attachments = attachments;
		this._creator = creator;
		this._createdAt = createdAt ?? new Date();
		this._updatedAt = updatedAt ?? new Date();
		this._isDeleted = isDeleted ?? false;
	}

	public static create(
		id: string,
		name: string,
		description: string,
		type: SpotType,
		address: SpotAddress,
		attachments: SpotAttachment[],
		creator: User,
		createdAt?: Date,
		updatedAt?: Date,
		isDeleted?: boolean,
	) {
		return new Spot(
			id,
			name,
			description,
			type,
			address,
			attachments,
			creator,
			createdAt,
			updatedAt,
			isDeleted,
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

	public type(): SpotType {
		return this._type;
	}

	public address(): SpotAddress {
		return this._address;
	}

	public attachments(): SpotAttachment[] {
		return this._attachments;
	}

	public creator(): User {
		return this._creator;
	}

	public createdAt(): Date {
		return this._createdAt;
	}

	public updatedAt(): Date {
		return this._updatedAt;
	}

	public isDeleted(): boolean {
		return this._isDeleted;
	}

	public changeName(name: string): void {
		this._name = name;
		this._updatedAt = new Date();
	}

	public changeDescription(description: string): void {
		this._description = description;
		this._updatedAt = new Date();
	}

	public changeType(type: SpotType): void {
		this._type = type;
		this._updatedAt = new Date();
	}

	public changeAddress(address: SpotAddress): void {
		this._address = address;
		this._updatedAt = new Date();
	}

	public findAttachment(id: string): SpotAttachment {
		return this._attachments.find((p) => p.id() === id);
	}

	public addAttachment(photo: SpotAttachment): void {
		this._attachments.push(photo);
		this._updatedAt = new Date();
	}

	public removeAttachment(id: string): void {
		this._attachments = this._attachments.filter((p) => p.id() !== id);
		this._updatedAt = new Date();
	}

	public visit(user: User): VisitedSpot {
		return VisitedSpot.create(this._id, this, user);
	}

	public favorite(user: User): Favorite {
		return Favorite.createForSpot(randomUUID(), user, this);
	}

	public comment(user: User, text: string): Comment {
		return Comment.create(
			randomUUID(),
			text,
			user,
			CommentableSubject.SPOT,
			this,
		);
	}

	public rate(value: number, user: User, comment?: string): Rating {
		return Rating.create(
			randomUUID(),
			value,
			RatableSubject.SPOT,
			this._id,
			user,
			comment,
		);
	}

	public delete(): void {
		this._isDeleted = true;
		this._updatedAt = new Date();
	}
}
