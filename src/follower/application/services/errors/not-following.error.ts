export class NotFollowingError extends Error {
	constructor(message = "Not following.") {
		super(message);
	}
}
