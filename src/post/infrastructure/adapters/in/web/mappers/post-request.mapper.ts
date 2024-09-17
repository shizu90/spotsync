import { CreatePostCommand } from 'src/post/application/ports/in/commands/create-post.command';
import { DeletePostCommand } from 'src/post/application/ports/in/commands/delete-post.command';
import { GetPostCommand } from 'src/post/application/ports/in/commands/get-post.command';
import { ListThreadsCommand } from 'src/post/application/ports/in/commands/list-threads.command';
import { UpdatePostCommand } from 'src/post/application/ports/in/commands/update-post.command';
import { CreatePostRequest } from '../requests/create-post.request';
import { ListThreadsQueryRequest } from '../requests/list-threads-query.request';
import { UpdatePostRequest } from '../requests/update-post.request';

export class PostRequestMapper {
	public static listThreadsCommand(
		query: ListThreadsQueryRequest,
	): ListThreadsCommand {
		return new ListThreadsCommand(
			query.user_id,
			query.group_id,
			query.sort,
			query.sort_direction,
			query.paginate,
			query.page,
			query.limit,
		);
	}

	public static getPostCommand(id: string): GetPostCommand {
		return new GetPostCommand(id);
	}

	public static createPostCommand(
		body: CreatePostRequest,
	): CreatePostCommand {
		return new CreatePostCommand(
			body.title,
			body.content,
			body.visibility,
			body.parent_id,
			body.group_id,
		);
	}

	public static updatePostCommand(
		id: string,
		body: UpdatePostRequest,
	): UpdatePostCommand {
		return new UpdatePostCommand(
			id,
			body.title,
			body.content,
			body.visibility,
		);
	}

	public static deletePostCommand(id: string): DeletePostCommand {
		return new DeletePostCommand(id);
	}
}
