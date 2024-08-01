import { LikeCommand } from 'src/like/application/ports/in/commands/like.command';
import { ListLikesCommand } from 'src/like/application/ports/in/commands/list-likes.command';
import { UnlikeCommand } from 'src/like/application/ports/in/commands/unlike.command';
import { LikableSubject } from 'src/like/domain/likable-subject.enum';
import { LikeRequest } from '../requests/like.request';
import { ListLikesQueryRequest } from '../requests/list-likes-query.request';

export class LikeRequestMapper {
	public static listLikesCommand(
		query: ListLikesQueryRequest,
	): ListLikesCommand {
		return new ListLikesCommand(
			query.subject,
			query.subject_id,
			query.sort,
			query.sort_direction,
			query.page,
			query.paginate,
			query.limit,
		);
	}

	public static likeCommand(body: LikeRequest): LikeCommand {
		return new LikeCommand(body.subject, body.subject_id);
	}

	public static unlikeCommand(
		subject: LikableSubject,
		subjectId: string,
	): UnlikeCommand {
		return new UnlikeCommand(subject, subjectId);
	}
}
