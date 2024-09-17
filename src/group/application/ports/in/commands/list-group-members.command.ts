import { Command } from 'src/common/core/common.command';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { GroupMemberStatus } from 'src/group/domain/group-member-status.enum';

export class ListGroupMembersCommand extends Command {
	constructor(
		readonly groupId: string,
		readonly status?: GroupMemberStatus,
		readonly name?: string,
		readonly roleId?: string,
		readonly sort?: string,
		readonly sortDirection?: SortDirection,
		readonly page?: number,
		readonly paginate?: boolean,
		readonly limit?: number,
	) {
		super();
	}
}
