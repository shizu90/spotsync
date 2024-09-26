export class GroupRoleNotFoundError extends Error {
	constructor(message = "Group role not found.") {
		super(message);
	}
}
