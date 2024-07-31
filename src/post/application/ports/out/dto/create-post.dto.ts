import { Dto } from 'src/common/common.dto';

export class CreatePostDto extends Dto {
	constructor(
		readonly id: string,
		readonly title: string,
		readonly content: string,
		readonly visibility: string,
		readonly attachments: { id: string; file_path: string, file_type: string }[],
		readonly thread_id: string,
		readonly depth_level: number,
		readonly parent_id: string,
		readonly user_id: string,
		readonly group_id: string,
	) {
		super();
	}
}
