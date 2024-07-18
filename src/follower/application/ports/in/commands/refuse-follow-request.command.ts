import { Command } from 'src/common/common.command';

export class RefuseFollowRequestCommand extends Command {
	constructor(readonly followRequestId: string) {
		super();
	}
}
