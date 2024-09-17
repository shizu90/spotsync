import { Dto } from 'src/common/core/common.dto';

export class GetFollowRequestDto extends Dto {
	constructor(
		readonly id: string,
		readonly from_user: {
			readonly id: string;
			readonly display_name: string;
			readonly theme_color: string;
			readonly profile_picture: string;
			readonly banner_picture: string;
			readonly birth_date: Date;
			readonly credentials: { name: string };
		},
		readonly to_user: {
			readonly id: string;
			readonly display_name: string;
			readonly theme_color: string;
			readonly profile_picture: string;
			readonly banner_picture: string;
			readonly birth_date: Date;
			readonly credentials: { name: string };
		},
		readonly requested_on: Date,
	) {
		super();
	}
}
