import { Dto } from 'src/common/core/common.dto';

export class GetGroupRequestDto extends Dto {
	constructor(
		readonly id: string,
		readonly user: {
			id: string;
			first_name: string;
			last_name: string;
			profile_picture: string;
			banner_picture: string;
			credentials: {
				name: string;
			};
		},
		readonly group_id: string,
		readonly requested_on: Date,
	) {
		super();
	}
}
