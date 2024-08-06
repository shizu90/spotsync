import { Dto } from 'src/common/core/common.dto';

export class FollowDto extends Dto {
	constructor(
		readonly id: string,
		readonly from_user_id: string,
		readonly to_user_id: string,
		readonly followed_on?: Date,
		readonly requested_on?: Date,
	) {
		super();
	}
}
