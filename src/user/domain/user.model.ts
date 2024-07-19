import { Model } from 'src/common/common.model';
import { UserCredentials } from './user-credentials.model';
import { UserVisibilityConfig } from './user-visibility-config.model';
import { UserVisibility } from './user-visibility.enum';
import * as moment from 'moment';

export class User extends Model {
	private _id: string;
	private _firstName: string;
	private _lastName: string;
	private _profileThemeColor: string;
	private _profilePicture: string;
	private _bannerPicture: string;
	private _biograph: string;
	private _birthDate: Date;
	private _credentials: UserCredentials;
	private _visibilityConfiguration: UserVisibilityConfig;
	private _createdAt: Date;
	private _updatedAt: Date;
	private _isDeleted: boolean;

	private constructor(
		id: string,
		firstName: string,
		lastName: string,
		profileThemeColor: string,
		profilePicture: string,
		bannerPicture: string,
		biograph: string,
		birthDate: Date,
		credentials?: UserCredentials,
		visibilityConfiguration?: UserVisibilityConfig,
		createdAt?: Date,
		updatedAt?: Date,
		isDeleted?: boolean,
	) {
		super();
		this._id = id;
		this._firstName = firstName;
		this._lastName = lastName;
		this._profileThemeColor = profileThemeColor;
		this._profilePicture = profilePicture;
		this._bannerPicture = bannerPicture;
		this._biograph = biograph;
		this._birthDate = birthDate;
		this._credentials = credentials ?? null;
		this._visibilityConfiguration = visibilityConfiguration ?? null;
		this._createdAt = createdAt ?? moment().toDate();
		this._updatedAt = updatedAt ?? moment().toDate();
		this._isDeleted = isDeleted ?? false;
	}

	public static create(
		id: string,
		firstName: string,
		lastName: string,
		profileThemeColor: string,
		profilePicture: string,
		bannerPicture: string,
		biograph: string,
		birthDate: Date,
		credentials?: UserCredentials,
		visibilityConfiguration?: UserVisibilityConfig,
		createdAt?: Date,
		updatedAt?: Date,
		isDeleted?: boolean,
	): User {
		return new User(
			id,
			firstName,
			lastName,
			profileThemeColor,
			profilePicture,
			bannerPicture,
			biograph,
			birthDate,
			credentials,
			visibilityConfiguration,
			createdAt,
			updatedAt,
			isDeleted,
		);
	}

	public id(): string {
		return this._id;
	}

	public firstName(): string {
		return this._firstName;
	}

	public lastName(): string {
		return this._lastName;
	}

	public fullName(): string {
		return `${this._firstName} ${this._lastName}`;
	}

	public profileThemeColor(): string {
		return this._profileThemeColor;
	}

	public profilePicture(): string {
		return this._profilePicture;
	}

	public bannerPicture(): string {
		return this._bannerPicture;
	}

	public biograph(): string {
		return this._biograph;
	}

	public birthDate(): Date {
		return this._birthDate;
	}

	public credentials(): UserCredentials {
		return this._credentials;
	}

	public visibilityConfiguration(): UserVisibilityConfig {
		return this._visibilityConfiguration;
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

	public changeFirstName(firstName: string): void {
		this._firstName = firstName;
		this._updatedAt = moment().toDate();
	}

	public changeLastName(lastName: string): void {
		this._lastName = lastName;
		this._updatedAt = moment().toDate();
	}

	public changeProfileThemeColor(profileThemeColor: string): void {
		this._profileThemeColor = profileThemeColor;
		this._updatedAt = moment().toDate();
	}

	public changeProfilePicture(profilePicture: string): void {
		this._profilePicture = profilePicture;
		this._updatedAt = moment().toDate();
	}

	public changeBannerPicture(bannerPicture: string): void {
		this._bannerPicture = bannerPicture;
		this._updatedAt = moment().toDate();
	}

	public changeBiograph(biograph: string): void {
		this._biograph = biograph;
		this._updatedAt = moment().toDate();
	}

	public changeBirthDate(birthDate: Date): void {
		this._birthDate = birthDate;
		this._updatedAt = moment().toDate();
	}

	public changeCredentials(userCredentials: UserCredentials): void {
		this._credentials = userCredentials;
		this._updatedAt = moment().toDate();
	}

	public changeVisibilityConfig(
		visibilityConfig: UserVisibilityConfig,
	): void {
		this._visibilityConfiguration = visibilityConfig;
		this._updatedAt = moment().toDate();
	}

	public delete(): void {
		this._isDeleted = true;
		this._updatedAt = moment().toDate();
	}

	public createCredentials(
		name: string,
		email: string,
		password: string,
		phoneNumber?: string,
	): UserCredentials {
		const credentials = UserCredentials.create(
			this._id,
			name,
			email,
			password,
			phoneNumber,
		);
		this._credentials = credentials;

		return credentials;
	}

	public createVisibilityConfig(
		profileVisibility: UserVisibility,
		addressVisibility: UserVisibility,
		postVisibility: UserVisibility,
		poiFolderVisibility: UserVisibility,
		visitedPoiVisibility: UserVisibility,
	): UserVisibilityConfig {
		const visibilityConfig = UserVisibilityConfig.create(
			this._id,
			profileVisibility,
			addressVisibility,
			poiFolderVisibility,
			visitedPoiVisibility,
			postVisibility,
		);
		this._visibilityConfiguration = visibilityConfig;

		return visibilityConfig;
	}
}
