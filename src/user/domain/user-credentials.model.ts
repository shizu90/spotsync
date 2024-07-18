import { Model } from 'src/common/common.model';

export class UserCredentials extends Model {
	private _id: string;
	private _name: string;
	private _email: string;
	private _password: string;
	private _lastLogin: Date;
	private _lastLogout: Date;

	private constructor(
		id: string,
		name: string,
		email: string,
		password: string,
		lastLogin?: Date,
		lastLogout?: Date,
	) {
		super();
		this._id = id;
		this._name = name;
		this._email = email;
		this._password = password;
		this._lastLogin = lastLogin ?? null;
		this._lastLogout = lastLogout ?? null;
	}

	public static create(
		id: string,
		name: string,
		email: string,
		password: string,
		lastLogin?: Date,
		lastLogout?: Date,
	): UserCredentials {
		return new UserCredentials(
			id,
			name,
			email,
			password,
			lastLogin,
			lastLogout,
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

	public lastLogin() {
		return this._lastLogin;
	}

	public lastLogout() {
		return this._lastLogout;
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

	public login() {
		this._lastLogin = new Date();
	}

	public logout() {
		this._lastLogout = new Date();
	}
}
