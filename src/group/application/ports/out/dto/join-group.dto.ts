import { Dto } from 'src/common/core/common.dto';

export class JoinGroupDto extends Dto {
	constructor(
		readonly id: string,
		readonly group_id: string,
		readonly user: {
			id: string,
			display_name: string,
			profile_picture: string,
			banner_picture: string,
			credentials: { name: string },
		},
		readonly role: {
			name: string,
			hex_color: string,
			permissions: {
				id: string,
				name: string,
			}[],
		},
		readonly joined_at: Date,
		readonly requested_at: Date,
		readonly status: string,
	) {
		super();
	}
}
