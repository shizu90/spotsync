import { Dto } from 'src/common/common.dto';

export class CreateUserDto extends Dto {
	constructor(
		readonly id: string,
		readonly biograph: string,
		readonly profile_picture: string,
		readonly banner_picture: string,
		readonly birth_date: Date,
		readonly is_deleted: boolean,
		readonly created_at: Date,
		readonly updated_at: Date,
		readonly visibility_configuration: {
			profile_visibility: string;
			address_visibility: string;
			poi_folder_visibility: string;
			visited_poi_visibility: string;
			post_visibility: string;
		},
		readonly credentials: { name: string; email: string },
	) {
		super();
	}
}
