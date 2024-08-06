import { Command } from 'src/common/core/common.command';

export class DeletePostCommand extends Command {
	constructor(readonly id: string) {
		super();
	}
}
