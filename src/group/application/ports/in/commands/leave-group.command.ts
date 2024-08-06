import { Command } from 'src/common/core/common.command';

export class LeaveGroupCommand extends Command {
	constructor(readonly id: string) {
		super();
	}
}
