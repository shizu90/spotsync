export class AlreadyFollowingError extends Error {
	constructor(message = "Already following.") {
		super(message);
	}
}
