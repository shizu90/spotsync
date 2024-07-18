import { Command } from 'src/common/common.command';
import { SortDirection } from 'src/common/enums/sort-direction.enum';

export class ListGroupRolesCommand extends Command {
	constructor(
		readonly groupId: string,
		readonly name?: string,
		readonly isImmutable?: boolean,
		readonly sort?: string,
		readonly sortDirection?: SortDirection,
		readonly page?: number,
		readonly paginate?: boolean,
		readonly limit?: number,
	) {
		super();
	}
}
