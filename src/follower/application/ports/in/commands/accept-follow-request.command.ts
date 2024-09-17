import { Command } from 'src/common/core/common.command';

export class AcceptFollowRequestCommand extends Command {
	constructor(readonly id: string) {
		super();
	}
}
