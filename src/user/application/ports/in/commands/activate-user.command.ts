import { Command } from 'src/common/core/common.command';

export class ActivateUserCommand extends Command {
	constructor(
		readonly userId: string,
		readonly activationCode: string,
		readonly autoLogin: boolean = false,
	) {
		super();
	}
}
