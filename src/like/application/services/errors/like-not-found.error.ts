export class LikeNotFoundError extends Error {
	constructor(message = 'Like not found.') {
		super(message);
	}
}
