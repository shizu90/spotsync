import { AcceptFollowRequestCommand } from "src/follower/application/ports/in/commands/accept-follow-request.command";
import { FollowCommand } from "src/follower/application/ports/in/commands/follow.command";
import { RefuseFollowRequestCommand } from "src/follower/application/ports/in/commands/refuse-follow-request.command";
import { UnfollowCommand } from "src/follower/application/ports/in/commands/unfollow.command";

export class FollowRequestMapper 
{
    public static followCommand(fromUserId: string, toUserId: string): FollowCommand
    {
        return new FollowCommand(
            fromUserId, 
            toUserId
        );
    }

    public static unfollowCommand(fromUserId: string, toUserId: string): UnfollowCommand
    {
        return new UnfollowCommand(
            fromUserId, 
            toUserId
        );
    }

    public static acceptFollowRequestCommand(followRequestId: string): AcceptFollowRequestCommand
    {
        return new AcceptFollowRequestCommand(
            followRequestId
        );
    }

    public static refuseFollowRequestCommand(followRequestId: string): RefuseFollowRequestCommand 
    {
        return new RefuseFollowRequestCommand(
            followRequestId
        );
    }
}