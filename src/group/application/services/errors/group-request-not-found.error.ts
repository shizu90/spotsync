export class GroupRequestNotFoundError extends Error {
	constructor(message = "Group join request not found.") {
		super(message);
	}
}
