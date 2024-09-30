import { Command } from 'src/common/core/common.command';

export class RemoveParticipationCommand extends Command {
	constructor(
		readonly spotEventId: string,
		readonly userId: string,
	) {
		super();
	}
}
