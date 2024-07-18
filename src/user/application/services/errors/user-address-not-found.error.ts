export class UserAddressNotFoundError extends Error {
	public code: number;

	public constructor(message: string) {
		super(message);
		this.code = 404;
	}
}
