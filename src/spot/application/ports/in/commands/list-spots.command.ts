import { Command } from 'src/common/core/common.command';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { SpotType } from 'src/spot/domain/spot-type.enum';

export class ListSpotsCommand extends Command {
	constructor(
		readonly name?: string,
		readonly type?: SpotType,
		readonly creatorId?: string,
		readonly sort?: string,
		readonly sortDirection?: SortDirection,
		readonly page?: number,
		readonly limit?: number,
		readonly paginate?: boolean,
	) {
		super();
	}
}
