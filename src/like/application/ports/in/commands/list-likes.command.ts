import { Command } from 'src/common/common.command';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { LikableSubject } from 'src/like/domain/likable-subject.enum';

export class ListLikesCommand extends Command {
	constructor(
		readonly subject?: LikableSubject,
		readonly subjectId?: string,
		readonly sort?: string,
		readonly sortDirection?: SortDirection,
		readonly page?: number,
		readonly paginate?: boolean,
		readonly limit?: number,
	) {
		super();
	}
}
