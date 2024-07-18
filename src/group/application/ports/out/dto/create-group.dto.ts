import { Dto } from 'src/common/common.dto';

export class CreateGroupDto extends Dto {
	constructor(
		readonly id: string,
		readonly name: string,
		readonly about: string,
		readonly group_picture: string,
		readonly banner_picture: string,
		readonly visibility_configuration: {
			group_visibility: string;
			post_visibility: string;
			event_visibility: string;
		},
		readonly created_at: Date,
		readonly updated_at: Date,
	) {
		super();
	}
}
