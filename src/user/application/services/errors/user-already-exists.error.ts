export class UserAlreadyExistsError extends Error {
	public code: number;

	constructor(message = "User already exists.") {
		super(message);
	}
}
