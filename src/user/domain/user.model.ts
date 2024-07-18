import { Model } from 'src/common/common.model';
import { UserCredentials } from './user-credentials.model';
import { UserVisibilityConfig } from './user-visibility-config.model';

export class User extends Model {
	private _id: string;
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
		profilePicture: string,
		bannerPicture: string,
		biograph: string,
		birthDate: Date,
		credentials: UserCredentials,
		visibilityConfiguration: UserVisibilityConfig,
		createdAt?: Date,
		updatedAt?: Date,
		isDeleted?: boolean,
	) {
		super();
		this._id = id;
		this._profilePicture = profilePicture;
		this._bannerPicture = bannerPicture;
		this._biograph = biograph;
		this._birthDate = birthDate;
		this._credentials = credentials;
		this._visibilityConfiguration = visibilityConfiguration;
		this._createdAt = createdAt ?? new Date();
		this._updatedAt = updatedAt ?? new Date();
		this._isDeleted = isDeleted ?? false;
	}

	public static create(
		id: string,
		profilePicture: string,
		bannerPicture: string,
		biograph: string,
		birthDate: Date,
		credentials: UserCredentials,
		visibilityConfiguration: UserVisibilityConfig,
		createdAt?: Date,
		updatedAt?: Date,
		isDeleted?: boolean,
	): User {
		return new User(
			id,
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

	public changeProfilePicture(profilePicture: string): void {
		this._profilePicture = profilePicture;
		this._updatedAt = new Date();
	}

	public changeBannerPicture(bannerPicture: string): void {
		this._bannerPicture = bannerPicture;
		this._updatedAt = new Date();
	}

	public changeBiograph(biograph: string): void {
		this._biograph = biograph;
		this._updatedAt = new Date();
	}

	public changeBirthDate(birthDate: Date): void {
		this._birthDate = birthDate;
		this._updatedAt = new Date();
	}

	public delete(): void {
		this._isDeleted = true;
		this._updatedAt = new Date();
	}
}
