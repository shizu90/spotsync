import { Command } from 'src/common/core/common.command';

export class SignOutCommand extends Command {
	constructor(readonly userId: string) {
		super();
	}
}
