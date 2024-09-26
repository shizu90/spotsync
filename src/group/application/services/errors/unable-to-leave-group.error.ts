export class UnableToLeaveGroupError extends Error {
	constructor(message = "Unable to leave group.") {
		super(message);
	}
}
