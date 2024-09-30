import { CommentableSubject } from 'src/comment/domain/commentable-subject.enum';
import { Command } from 'src/common/core/common.command';

export class CreateCommentCommand extends Command {
	public constructor(
		readonly subject: CommentableSubject,
		readonly subjectId: string,
		readonly text: string,
	) {
		super();
	}
}
