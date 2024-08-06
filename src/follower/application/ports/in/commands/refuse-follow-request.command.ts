import { Command } from 'src/common/core/common.command';

export class RefuseFollowRequestCommand extends Command {
	constructor(readonly followRequestId: string) {
		super();
	}
}
