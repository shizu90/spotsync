import { ListGroupMembersCommand } from "src/group/application/ports/in/commands/list-group-members.command";
import { ListGroupMembersQueryRequest } from "./requests/list-group-members-query.request";
import { JoinGroupCommand } from "src/group/application/ports/in/commands/join-group.command";
import { LeaveGroupCommand } from "src/group/application/ports/in/commands/leave-group.command";
import { ChangeMemberRoleRequest } from "./requests/change-member-role.request";
import { ChangeMemberRoleCommand } from "src/group/application/ports/in/commands/change-member-role.command";
import { AcceptGroupRequestCommand } from "src/group/application/ports/in/commands/accept-group-request.command";
import { RefuseGroupRequestCommand } from "src/group/application/ports/in/commands/refuse-group-request.command";

export class GroupMemberRequestMapper 
{
    public static listGroupMembersCommand(groupId: string, query: ListGroupMembersQueryRequest): ListGroupMembersCommand 
    {
        return new ListGroupMembersCommand(
            groupId,
            query.name,
            query.role_id,
            query.sort,
            query.sort_direction,
            query.page,
            query.paginate,
            query.limit
        );
    }

    public static joinGroupCommand(groupId: string): JoinGroupCommand {
        return new JoinGroupCommand(
            groupId
        );
    }

    public static leaveGroupCommand(groupId: string): LeaveGroupCommand 
    {
        return new LeaveGroupCommand(
            groupId
        );
    }

    public static changeMemberRoleCommand(groupId: string, memberId: string, request: ChangeMemberRoleRequest): ChangeMemberRoleCommand 
    {
        return new ChangeMemberRoleCommand(
            memberId,
            groupId,
            request.role_id
        );
    }

    public static acceptGroupRequestCommand(groupId: string, requestId: string) 
    {
        return new AcceptGroupRequestCommand(
            requestId,
            groupId
        );
    }

    public static refuseGroupRequestCommand(groupId: string, requestId: string) 
    {
        return new RefuseGroupRequestCommand(
            requestId,
            groupId
        );
    }
}