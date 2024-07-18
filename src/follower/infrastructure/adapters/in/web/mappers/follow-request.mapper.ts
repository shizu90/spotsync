import { AcceptFollowRequestCommand } from 'src/follower/application/ports/in/commands/accept-follow-request.command';
import { FollowCommand } from 'src/follower/application/ports/in/commands/follow.command';
import { RefuseFollowRequestCommand } from 'src/follower/application/ports/in/commands/refuse-follow-request.command';
import { UnfollowCommand } from 'src/follower/application/ports/in/commands/unfollow.command';
import { ListFollowsCommand } from 'src/follower/application/ports/in/commands/list-follows.command';
import { ListFollowRequestsQueryRequest } from '../requests/list-follow-requests-query.request';
import { ListFollowRequestsCommand } from 'src/follower/application/ports/in/commands/list-follow-requests.command';
import { ListFollowsQueryRequest } from '../requests/list-follows-query.request';

export class FollowRequestMapper {
	public static listFollowsCommand(
		query: ListFollowsQueryRequest,
	): ListFollowsCommand {
		return new ListFollowsCommand(
			query.from_user_id,
			query.to_user_id,
			query.sort,
			query.sort_direction,
			query.paginate,
			query.page,
			query.limit,
		);
	}

	public static listFollowRequestsCommand(
		query: ListFollowRequestsQueryRequest,
	): ListFollowRequestsCommand {
		return new ListFollowRequestsCommand(
			query.from_user_id,
			query.to_user_id,
			query.sort,
			query.sort_direction,
			query.paginate,
			query.page,
			query.limit,
		);
	}

	public static followCommand(
		fromUserId: string,
		toUserId: string,
	): FollowCommand {
		return new FollowCommand(fromUserId, toUserId);
	}

	public static unfollowCommand(
		fromUserId: string,
		toUserId: string,
	): UnfollowCommand {
		return new UnfollowCommand(fromUserId, toUserId);
	}

	public static acceptFollowRequestCommand(
		followRequestId: string,
	): AcceptFollowRequestCommand {
		return new AcceptFollowRequestCommand(followRequestId);
	}

	public static refuseFollowRequestCommand(
		followRequestId: string,
	): RefuseFollowRequestCommand {
		return new RefuseFollowRequestCommand(followRequestId);
	}
}
