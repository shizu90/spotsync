import { Model } from 'src/common/core/common.model';
import { User } from 'src/user/domain/user.model';

export class UserAddress extends Model {
	private _id: string;
	private _name: string;
	private _area: string;
	private _subArea: string;
	private _locality: string;
	private _latitude: number;
	private _longitude: number;
	private _countryCode: string;
	private _main: boolean;
	private _user: User;
	private _createdAt: Date;
	private _updatedAt: Date;
	private _isDeleted: boolean;

	private constructor(
		id: string,
		name: string,
		area: string,
		subArea: string,
		locality: string,
		latitude: number,
		longitude: number,
		countryCode: string,
		main: boolean,
		user: User,
		createdAt?: Date,
		updatedAt?: Date,
		isDeleted?: boolean,
	) {
		super();
		this._id = id;
		this._name = name;
		this._area = area;
		this._subArea = subArea;
		this._locality = locality;
		this._latitude = latitude;
		this._longitude = longitude;
		this._countryCode = countryCode;
		this._main = main;
		this._user = user;
		this._createdAt = createdAt ?? new Date();
		this._updatedAt = updatedAt ?? new Date();
		this._isDeleted = isDeleted ?? false;
	}

	public static create(
		id: string,
		name: string,
		area: string,
		subArea: string,
		locality: string,
		latitude: number,
		longitude: number,
		countryCode: string,
		main: boolean,
		user: User,
		createdAt?: Date,
		updatedAt?: Date,
		isDeleted?: boolean,
	) {
		return new UserAddress(
			id,
			name,
			area,
			subArea,
			locality,
			latitude,
			longitude,
			countryCode,
			main,
			user,
			createdAt,
			updatedAt,
			isDeleted,
		);
	}

	public id() {
		return this._id;
	}

	public name() {
		return this._name;
	}

	public area() {
		return this._area;
	}

	public subArea() {
		return this._subArea;
	}

	public locality() {
		return this._locality;
	}

	public latitude() {
		return this._latitude;
	}

	public longitude() {
		return this._longitude;
	}

	public countryCode() {
		return this._countryCode;
	}

	public main() {
		return this._main;
	}

	public user() {
		return this._user;
	}

	public createdAt() {
		return this._createdAt;
	}

	public updatedAt() {
		return this._updatedAt;
	}

	public isDeleted() {
		return this._isDeleted;
	}

	public changeName(name: string) {
		this._name = name;
		this._updatedAt = new Date();
	}

	public changeArea(area: string) {
		this._area = area;
		this._updatedAt = new Date();
	}

	public changeSubArea(subArea: string) {
		this._subArea = subArea;
		this._updatedAt = new Date();
	}

	public changeLocality(locality: string) {
		this._locality = locality;
		this._updatedAt = new Date();
	}

	public changeLatitude(latitude: number) {
		this._latitude = latitude;
		this._updatedAt = new Date();
	}

	public changeLongitude(longitude: number) {
		this._longitude = longitude;
		this._updatedAt = new Date();
	}

	public changeCountryCode(countryCode: string) {
		this._countryCode = countryCode;
		this._updatedAt = new Date();
	}

	public changeMain(main: boolean) {
		this._main = main;
		this._updatedAt = new Date();
	}

	public delete() {
		this._isDeleted = true;
		this._updatedAt = new Date();
	}
}
