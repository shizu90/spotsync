export class GroupMemberNotFoundError extends Error {
	constructor(message = "Group member not found.") {
		super(message);
	}
}
