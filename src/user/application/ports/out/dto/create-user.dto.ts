import { Dto } from 'src/common/common.dto';

export class CreateUserDto extends Dto {
	constructor(
		readonly id: string,
		readonly first_name: string,
		readonly last_name: string,
		readonly profile_theme_color: string,
		readonly biograph: string,
		readonly profile_picture: string,
		readonly banner_picture: string,
		readonly birth_date: Date,
		readonly is_deleted: boolean,
		readonly created_at: Date,
		readonly updated_at: Date,
		readonly visibility_configuration: {
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
	) {
		super();
	}
}
