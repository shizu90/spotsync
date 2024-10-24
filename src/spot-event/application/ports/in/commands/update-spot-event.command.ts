import { Command } from 'src/common/core/common.command';

export class UpdateSpotEventCommand extends Command {
	constructor(
		readonly id: string,
		readonly name?: string,
		readonly description?: string,
		readonly startDate?: Date,
		readonly endDate?: Date,
		readonly notifyMinutes?: number,
	) {
		super();
	}
}
