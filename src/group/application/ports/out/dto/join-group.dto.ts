import { Dto } from 'src/common/core/common.dto';

export class JoinGroupDto extends Dto {
	constructor(
		readonly id: string,
		readonly group_id: string,
		readonly user_id: string,
		readonly requested_on: Date,
	) {
		super();
	}
}
