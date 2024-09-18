import { Dto } from 'src/common/core/common.dto';

export class GetUserProfileDto extends Dto {
	constructor(
		readonly id: string,
		readonly status: string,
		readonly created_at: Date,
		readonly updated_at: Date,
		readonly credentials: {
			name: string;
		},
		readonly profile: {
			birth_date: Date;
			display_name: string;
			theme_color: string;
			biograph: string;
			profile_picture: string;
			banner_picture: string;
			visibility: string;
		},
		readonly visibility_settings: {
			profile: string;
			addresses: string;
			visited_spots: string;
			posts: string;
			favorite_spots: string;
			favorite_spot_events: string;
			favorite_spot_folders: string;
			spot_folders: string;
		},
		readonly total_followers: number,
		readonly total_following: number,
		readonly address?: {
			id: string;
			name: string;
			area: string;
			sub_area: string;
			locality: string;
			latitude: number;
			longitude: number;
			country_code: string;
			created_at: Date;
			updated_at: Date;
		},
		readonly following?: boolean,
	) {
		super();
	}
}
