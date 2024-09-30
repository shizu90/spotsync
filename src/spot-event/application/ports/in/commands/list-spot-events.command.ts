import { Command } from 'src/common/core/common.command';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { SpotEventStatus } from 'src/spot-event/domain/spot-event-status.enum';
import { SpotEventVisibility } from 'src/spot-event/domain/spot-event-visibility.enum';

export class ListSpotEventsCommand extends Command {
	constructor(
		readonly spotId?: string,
		readonly groupId?: string,
		readonly startDate?: Date,
		readonly endDate?: Date,
		readonly visibility?: SpotEventVisibility,
		readonly status?: SpotEventStatus,
		readonly sort?: string,
		readonly sortDirection?: SortDirection,
		readonly page?: number,
		readonly limit?: number,
		readonly paginate?: boolean,
	) {
		super();
	}
}
