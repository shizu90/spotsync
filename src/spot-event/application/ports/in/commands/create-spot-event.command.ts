import { Command } from 'src/common/core/common.command';

export class CreateSpotEventCommand extends Command {
	constructor(
		readonly spotId: string,
		readonly name: string,
		readonly description: string,
		readonly startDate: Date,
		readonly endDate: Date,
		readonly groupId?: string,
	) {
		super();
	}
}
