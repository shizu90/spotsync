export class AlreadyMemberOfGroupError extends Error {
	constructor(message = 'Already member of group.') {
		super(message);
	}
}
