import { Dto } from 'src/common/core/common.dto';

export class GetSpotDto extends Dto {
	constructor(
		readonly id: string,
		readonly name: string,
		readonly description: string,
		readonly type: string,
		readonly address: {
			readonly area: string;
			readonly sub_area: string;
			readonly locality: string;
			readonly latitude: number;
			readonly longitude: number;
			readonly country_code: string;
		},
		readonly photos: {
			id: string;
			file_path: string;
		}[],
		readonly user_id: string,
		readonly distance: number,
		readonly visited: boolean,
		readonly favorited: boolean,
		readonly average_rating: number,
		readonly total_ratings: number,
		readonly total_spot_visits: number,
		readonly total_events: number,
		readonly created_at: Date,
		readonly updated_at: Date,
	) {
		super();
	}
}
