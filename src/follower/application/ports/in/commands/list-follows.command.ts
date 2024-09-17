import { Command } from 'src/common/core/common.command';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { FollowStatus } from 'src/follower/domain/follow-status.enum';

export class ListFollowsCommand extends Command {
	constructor(
		readonly status?: FollowStatus,
		readonly from_user_id?: string,
		readonly to_user_id?: string,
		readonly sort?: string,
		readonly sortDirection?: SortDirection,
		readonly paginate?: boolean,
		readonly page?: number,
		readonly limit?: number,
	) {
		super();
	}
}
