export class GroupRoleAlreadyExistsError extends Error {
	constructor(message = 'Group role already exists.') {
		super(message);
	}
}
