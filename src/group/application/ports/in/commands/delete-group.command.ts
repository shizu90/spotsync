import { Command } from 'src/common/core/common.command';

export class DeleteGroupCommand extends Command {
	constructor(readonly id: string) {
		super();
	}
}
