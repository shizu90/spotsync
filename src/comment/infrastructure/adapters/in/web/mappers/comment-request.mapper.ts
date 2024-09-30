import { CreateCommentCommand } from 'src/comment/application/ports/in/commands/create-comment.command';
import { DeleteCommentCommand } from 'src/comment/application/ports/in/commands/delete-comment.command';
import { ListCommentsCommand } from 'src/comment/application/ports/in/commands/list-comments.command';
import { UpdateCommentCommand } from 'src/comment/application/ports/in/commands/update-comment.command';
import { CreateCommentRequest } from '../requests/create-comment.request';
import { ListCommentsQueryRequest } from '../requests/list-comments-query.request';
import { UpdateCommentRequest } from '../requests/update-comment.request';

export class CommentRequestMapper {
	public static listCommentsCommand(
		query: ListCommentsQueryRequest,
	): ListCommentsCommand {
		return new ListCommentsCommand(
			query.subject,
			query.subject_id,
			query.user_id,
			query.sort,
			query.sort_direction,
			query.page,
			query.limit,
			query.paginate,
		);
	}

	public static createCommentCommand(
		body: CreateCommentRequest,
	): CreateCommentCommand {
		return new CreateCommentCommand(
			body.subject,
			body.subject_id,
			body.text,
		);
	}

	public static updateCommentCommand(
		id: string,
		body: UpdateCommentRequest,
	): UpdateCommentCommand {
		return new UpdateCommentCommand(id, body.text);
	}

	public static deleteCommentCommand(id: string): DeleteCommentCommand {
		return new DeleteCommentCommand(id);
	}
}
