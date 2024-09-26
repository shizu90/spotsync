export class UserAddressNotFoundError extends Error {
	public code: number;

	public constructor(message = "User address not found.") {
		super(message);
		this.code = 404;
	}
}
