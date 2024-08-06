import { Command } from 'src/common/core/common.command';

export class CreateUserCommand extends Command {
	constructor(
		readonly name: string,
		readonly email: string,
		readonly password: string,
		readonly phoneNumber?: string,
	) {
		super();
	}
}
