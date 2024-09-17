import { Dto } from 'src/common/core/common.dto';

export class GetLikeDto extends Dto {
	constructor(
		readonly id: string,
		readonly subject: string,
		readonly subject_id: string,
		readonly user: {
			id: string;
			display_name: string;
			theme_color: string;
			profile_picture: string;
			banner_picture: string;
			credentials: { name: string };
		},
		readonly created_at: Date,
	) {
		super();
	}
}
