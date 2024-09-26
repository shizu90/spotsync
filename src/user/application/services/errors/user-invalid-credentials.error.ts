export class UserInvalidCredentialsError extends Error {
	constructor(message = "Invalid credentials.") {
		super(message);
	}
}
