import { Command } from 'src/common/common.command';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { PostVisibility } from 'src/post/domain/post-visibility.enum';

export class ListThreadsCommand extends Command {
	constructor(
		readonly visibility?: PostVisibility,
		readonly userId?: string,
		readonly groupId?: string,
		readonly sort?: string,
		readonly sortDirection?: SortDirection,
		readonly paginate?: boolean,
		readonly page?: number,
		readonly limit?: number,
	) {
		super();
	}
}
