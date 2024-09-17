import { AcceptGroupRequestCommand } from 'src/group/application/ports/in/commands/accept-group-request.command';
import { ChangeMemberRoleCommand } from 'src/group/application/ports/in/commands/change-member-role.command';
import { JoinGroupCommand } from 'src/group/application/ports/in/commands/join-group.command';
import { LeaveGroupCommand } from 'src/group/application/ports/in/commands/leave-group.command';
import { ListGroupMembersCommand } from 'src/group/application/ports/in/commands/list-group-members.command';
import { RefuseGroupRequestCommand } from 'src/group/application/ports/in/commands/refuse-group-request.command';
import { RemoveGroupMemberCommand } from 'src/group/application/ports/in/commands/remove-group-member.command';
import { ChangeMemberRoleRequest } from '../requests/change-member-role.request';
import { ListGroupMembersQueryRequest } from '../requests/list-group-members-query.request';

export class GroupMemberRequestMapper {
	public static listGroupMembersCommand(
		groupId: string,
		query: ListGroupMembersQueryRequest,
	): ListGroupMembersCommand {
		return new ListGroupMembersCommand(
			groupId,
			query.status,
			query.name,
			query.role_id,
			query.sort,
			query.sort_direction,
			query.page,
			query.paginate,
			query.limit,
		);
	}

	public static joinGroupCommand(groupId: string): JoinGroupCommand {
		return new JoinGroupCommand(groupId);
	}

	public static leaveGroupCommand(groupId: string): LeaveGroupCommand {
		return new LeaveGroupCommand(groupId);
	}

	public static changeMemberRoleCommand(
		groupId: string,
		memberId: string,
		request: ChangeMemberRoleRequest,
	): ChangeMemberRoleCommand {
		return new ChangeMemberRoleCommand(memberId, groupId, request.role_id);
	}

	public static acceptGroupRequestCommand(
		groupId: string,
		requestId: string,
	): AcceptGroupRequestCommand {
		return new AcceptGroupRequestCommand(requestId, groupId);
	}

	public static refuseGroupRequestCommand(
		groupId: string,
		requestId: string,
	): RefuseGroupRequestCommand {
		return new RefuseGroupRequestCommand(requestId, groupId);
	}

	public static removeGroupMemberCommand(
		groupId: string,
		memberId: string,
	): RemoveGroupMemberCommand {
		return new RemoveGroupMemberCommand(memberId, groupId);
	}
}
