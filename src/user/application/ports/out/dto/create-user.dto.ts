import { Dto } from 'src/common/core/common.dto';

export class CreateUserDto extends Dto {
	constructor(
		readonly id: string,
		readonly birth_date: Date,
		readonly created_at: Date,
		readonly updated_at: Date,
		readonly visibility_settings: {
			profile: string;
			addresses: string;
			spot_folders: string;
			visited_spots: string;
			posts: string;
			favorite_spots: string;
			favorite_spot_folders: string;
			favorite_spot_events: string;
		},
		readonly credentials: {
			name: string;
			email: string;
			phone_number: string;
		},
		readonly profile: {
			display_name: string,
			theme_color: string,
			biograph: string,
			profile_picture: string,
			banner_picture: string,
			visibility: string,
		}
	) {
		super();
	}
}
