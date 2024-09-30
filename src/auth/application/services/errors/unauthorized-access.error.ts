export class UnauthorizedAccessError extends Error {
	constructor(message = 'Unauthorized access.') {
		super(message);
	}
}
