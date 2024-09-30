import { Command } from 'src/common/core/common.command';
import { SpotEventVisibility } from 'src/spot-event/domain/spot-event-visibility.enum';

export class CreateSpotEventCommand extends Command {
	constructor(
		readonly spotId: string,
		readonly name: string,
		readonly description: string,
		readonly startDate: Date,
		readonly endDate: Date,
		readonly groupId?: string,
		readonly visibility?: SpotEventVisibility,
	) {
		super();
	}
}
