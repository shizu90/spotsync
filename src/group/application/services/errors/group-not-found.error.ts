export class GroupNotFoundError extends Error {
	constructor(message = 'Group not found.') {
		super(message);
	}
}
