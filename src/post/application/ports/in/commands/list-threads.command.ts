import { Command } from 'src/common/core/common.command';
import { SortDirection } from 'src/common/enums/sort-direction.enum';

export class ListThreadsCommand extends Command {
	constructor(
		readonly userId?: string,
		readonly groupId?: string,
		readonly parentId?: string,
		readonly depthLevel?: number,
		readonly sort?: string,
		readonly sortDirection?: SortDirection,
		readonly paginate?: boolean,
		readonly page?: number,
		readonly limit?: number,
	) {
		super();
	}
}
