import { Command } from 'src/common/core/common.command';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { SpotType } from 'src/spot/domain/spot-type.enum';

export class ListSpotsCommand extends Command {
	constructor(
		readonly name?: string,
		readonly type?: SpotType[],
		readonly minRating?: number,
		readonly maxRating?: number,
		readonly minDistance?: number,
		readonly maxDistance?: number,
		readonly country?: string,
		readonly state?: string,
		readonly city?: string,
		readonly creatorId?: string,
		readonly favoritedById?: string,
		readonly visitedById?: string,
		readonly sort?: string,
		readonly sortDirection?: SortDirection,
		readonly page?: number,
		readonly limit?: number,
		readonly paginate?: boolean,
		readonly include?: string[],
	) {
		super();
	}
}
