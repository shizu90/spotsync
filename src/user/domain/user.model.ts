import { Model } from 'src/common/core/common.model';
import { UserCredentials } from './user-credentials.model';
import { UserProfile } from './user-profile.model';
import { UserStatus } from './user-status.enum';
import { UserVisibilitySettings } from './user-visibility-settings.model';

export class User extends Model {
	private _id: string;
	private _profile: UserProfile;
	private _credentials: UserCredentials;
	private _visibilitySettings: UserVisibilitySettings;
	private _status: UserStatus;
	private _createdAt: Date;
	private _updatedAt: Date;
	private _isDeleted: boolean;

	private constructor(
		id: string,
		profile: UserProfile,
		credentials: UserCredentials,
		visibilitySettings: UserVisibilitySettings,
		status?: UserStatus,
		createdAt?: Date,
		updatedAt?: Date,
		isDeleted?: boolean,
	) {
		super();
		this._id = id;
		this._profile = profile;
		this._credentials = credentials;
		this._visibilitySettings = visibilitySettings;
		this._status = status ?? UserStatus.INACTIVE;
		this._createdAt = createdAt ?? new Date();
		this._updatedAt = updatedAt ?? new Date();
		this._isDeleted = isDeleted ?? false;
	}

	public static create(
		id: string,
		profile: UserProfile,
		credentials: UserCredentials,
		visibilitySettings: UserVisibilitySettings,
		status?: UserStatus,
		createdAt?: Date,
		updatedAt?: Date,
		isDeleted?: boolean,
	): User {
		return new User(
			id,
			profile,
			credentials,
			visibilitySettings,
			status,
			createdAt,
			updatedAt,
			isDeleted,
		);
	}

	public id(): string {
		return this._id;
	}

	public profile(): UserProfile {
		return this._profile;
	}

	public credentials(): UserCredentials {
		return this._credentials;
	}

	public visibilitySettings(): UserVisibilitySettings {
		return this._visibilitySettings;
	}

	public status(): UserStatus {
		return this._status;
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

	public delete(): void {
		this._isDeleted = true;
		this._updatedAt = new Date();
	}

	public activate(): void {
		this._status = UserStatus.ACTIVE;
		this._updatedAt = new Date();
	}

	public deactivate(): void {
		this._status = UserStatus.INACTIVE;
		this._updatedAt = new Date();
	}

	public changeProfile(profile: UserProfile): void {
		this._profile = profile;
		this._updatedAt = new Date();
	}

	public changeVisibilitySettings(visibilitySettings: UserVisibilitySettings): void {
		this._visibilitySettings = visibilitySettings;
		this._updatedAt = new Date();
	}

	public changeCredentials(credentials: UserCredentials): void {
		this._credentials = credentials;
		this._updatedAt = new Date();
	}
}
 