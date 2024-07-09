import { FollowCommand } from "src/follower/application/ports/in/commands/follow.command";
import { UnfollowCommand } from "src/follower/application/ports/in/commands/unfollow.command";

export class FollowRequestMapper 
{
    public static followCommand(fromUserId: string, toUserId: string) 
    {
        return new FollowCommand(fromUserId, toUserId);
    }

    public static unfollowCommand(fromUserId: string, toUserId: string) 
    {
        return new UnfollowCommand(fromUserId, toUserId);
    }
}