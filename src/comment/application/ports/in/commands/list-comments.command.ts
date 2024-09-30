import { CommentableSubject } from 'src/comment/domain/commentable-subject.enum';
import { Command } from 'src/common/core/common.command';
import { SortDirection } from 'src/common/enums/sort-direction.enum';

export class ListCommentsCommand extends Command {
	constructor(
		readonly subject: CommentableSubject,
		readonly subjectId: string,
		readonly userId: string,
		readonly sort: string,
		readonly sortDirection: SortDirection,
		readonly page: number,
		readonly limit: number,
		readonly paginate: boolean,
	) {
		super();
	}
}
