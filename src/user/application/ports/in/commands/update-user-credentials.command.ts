import { Command } from 'src/common/core/common.command';

export class UpdateUserCredentialsCommand extends Command {
	constructor(
		readonly id: string,
		readonly name?: string,
		readonly email?: string,
		readonly password?: string,
		readonly phoneNumber?: string,
	) {
		super();
	}
}
