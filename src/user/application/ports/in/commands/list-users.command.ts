import { Command } from 'src/common/core/common.command';
import { SortDirection } from 'src/common/enums/sort-direction.enum';

export class ListUsersCommand extends Command {
	constructor(
		readonly displayName?: string,
		readonly name?: string,
		readonly sort?: string,
		readonly sortDirection?: SortDirection,
		readonly page?: number,
		readonly paginate?: boolean,
		readonly limit?: number,
	) {
		super();
	}
}
