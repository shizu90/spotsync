import { Dto } from 'src/common/common.dto';

export class GetPostDto extends Dto {
	constructor(
		readonly id: string,
		readonly title: string,
		readonly content: string,
		readonly attachments: {
			id: string;
			file_path: string;
			file_type: string;
		}[],
		readonly creator: {
			id: string;
			first_name: string;
			last_name: string;
			profile_theme_color: string;
			profile_picture: string;
			banner_picture: string;
			credentials: { name: string };
		},
		readonly visibility: string,
		readonly depth_level: number,
		readonly thread_id: string,
		readonly created_at: Date,
		readonly updated_at: Date,
		readonly parent_id: string,
		readonly group_id: string,
		readonly children_posts: GetPostDto[],
		readonly total_childrens: number,
	) {
		super();
	}
}
