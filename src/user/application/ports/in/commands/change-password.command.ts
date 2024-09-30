import { Command } from 'src/common/core/common.command';

export class ChangePasswordCommand extends Command {
	constructor(
		readonly password: string,
		readonly token: string,
	) {
		super();
	}
}
