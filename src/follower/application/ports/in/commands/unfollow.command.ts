import { Command } from 'src/common/core/common.command';

export class UnfollowCommand extends Command {
	constructor(
		readonly fromUserId: string,
		readonly toUserId: string,
	) {
		super();
	}
}
