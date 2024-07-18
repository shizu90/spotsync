import { Command } from 'src/common/common.command';

export class DeleteUserCommand extends Command {
	constructor(readonly id: string) {
		super();
	}
}
