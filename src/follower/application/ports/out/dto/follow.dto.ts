import { Dto } from 'src/common/core/common.dto';

export class FollowDto extends Dto {
	constructor(
		readonly id: string,
		readonly from_user_id: string,
		readonly to_user_id: string,
		readonly status: string,
		readonly followed_at?: Date,
		readonly requested_at?: Date,
	) {
		super();
	}
}
