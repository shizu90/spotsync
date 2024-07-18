import { Dto } from 'src/common/common.dto';

export class GetGroupMemberDto extends Dto {
	constructor(
		readonly id: string,
		readonly user: {
			id: string;
			credentials: { name: string };
			first_name: string;
			last_name: string;
			profile_picture: string;
			banner_picture: string;
		},
		readonly group_id: string,
		readonly role: {
			id: string;
			name: string;
			hex_color: string;
			permissions: {
				id: string;
				name: string;
			}[];
		},
		readonly joined_at: Date,
		readonly is_creator: boolean,
	) {
		super();
	}
}
