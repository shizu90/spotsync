import { Dto } from 'src/common/common.dto';

export class GetFollowRequestDto extends Dto {
	constructor(
		readonly id: string,
		readonly from_user: {
			readonly id: string;
			readonly first_name: string;
			readonly last_name: string;
			readonly profile_theme_color: string;
			readonly profile_picture: string;
			readonly banner_picture: string;
			readonly birth_date: Date;
			readonly credentials: { name: string };
			readonly visibility_config: {
				profile_visibility: string;
				post_visibility: string;
				poi_folder_visibility: string;
				visited_poi_visibility: string;
				address_visibility: string;
			};
		},
		readonly to_user: {
			readonly id: string;
			readonly first_name: string;
			readonly last_name: string;
			readonly profile_theme_color: string;
			readonly profile_picture: string;
			readonly banner_picture: string;
			readonly birth_date: Date;
			readonly credentials: { name: string };
			readonly visibility_config: {
				profile_visibility: string;
				post_visibility: string;
				poi_folder_visibility: string;
				visited_poi_visibility: string;
				address_visibility: string;
			};
		},
		readonly requested_on: Date,
	) {
		super();
	}
}
