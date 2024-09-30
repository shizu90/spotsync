import { Command } from 'src/common/core/common.command';

export class ForgotPasswordCommand extends Command {
	constructor(readonly email: string) {
		super();
	}
}
