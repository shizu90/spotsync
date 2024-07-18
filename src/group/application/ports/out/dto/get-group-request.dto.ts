import { Dto } from 'src/common/common.dto';

export class GetGroupRequestDto extends Dto {
	constructor(
		readonly id: string,
		readonly user: {
			id: string;
			profile_picture: string;
			banner_picture: string;
			birth_date: Date;
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
