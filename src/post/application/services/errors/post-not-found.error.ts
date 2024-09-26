export class PostNotFoundError extends Error {
	constructor(message = "Post not found.") {
		super(message);
	}
}
