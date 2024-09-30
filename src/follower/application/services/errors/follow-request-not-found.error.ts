export class FollowRequestNotFoundError extends Error {
	constructor(message = 'Follow request not found.') {
		super(message);
	}
}
