import { Command } from 'src/common/core/common.command';

export class DeleteUserCommand extends Command {
	constructor(readonly id: string) {
		super();
	}
}
