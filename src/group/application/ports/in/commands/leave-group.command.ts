import { Command } from 'src/common/common.command';

export class LeaveGroupCommand extends Command {
	constructor(readonly id: string) {
		super();
	}
}
