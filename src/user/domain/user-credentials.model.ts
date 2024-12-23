import { Model } from 'src/common/core/common.model';

export class UserCredentials extends Model {
	private _id: string;
	private _name: string;
	private _email: string;
	private _password: string;
	private _phoneNumber: string;
	private _lastLogin: Date;

	private constructor(
		id: string,
		name: string,
		email: string,
		password: string,
		phoneNumber?: string,
		lastLogin?: Date,
	) {
		super();
		this._id = id;
		this._name = name;
		this._email = email;
		this._password = password;
		this._phoneNumber = phoneNumber ?? null;
		this._lastLogin = lastLogin ?? null;
	}

	public static create(
		id: string,
		name: string,
		email: string,
		password: string,
		phoneNumber?: string,
		lastLogin?: Date,
	): UserCredentials {
		return new UserCredentials(
			id,
			name,
			email,
			password,
			phoneNumber,
			lastLogin,
		);
	}

	public id() {
		return this._id;
	}

	public name() {
		return this._name;
	}

	public email() {
		return this._email;
	}

	public password() {
		return this._password;
	}

	public phoneNumber() {
		return this._phoneNumber;
	}

	public lastLogin() {
		return this._lastLogin;
	}

	public changeName(name: string) {
		this._name = name;
	}

	public changeEmail(email: string) {
		this._email = email;
	}

	public changePassword(password: string) {
		this._password = password;
	}

	public changePhoneNumber(phoneNumber: string) {
		this._phoneNumber = phoneNumber;
	}

	public login() {
		this._lastLogin = new Date();
	}
}
