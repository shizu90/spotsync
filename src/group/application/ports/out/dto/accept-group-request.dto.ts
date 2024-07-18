import { Dto } from 'src/common/common.dto';

export class AcceptGroupRequestDto extends Dto {
	constructor(
		readonly group_id: string,
		readonly user: {
			id: string;
			credentials: { name: string };
			first_name: string;
			last_name: string;
			profile_picture: string;
			banner_picture: string;
		},
		readonly joined_at: Date,
		readonly group_role: {
			name: string;
			hex_color: string;
			permissions: {
				id: string;
				name: string;
			}[];
		},
	) {
		super();
	}
}
