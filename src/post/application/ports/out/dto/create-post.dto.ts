import { Dto } from 'src/common/common.dto';
import { PostVisibility } from 'src/post/domain/post-visibility.enum';

export class CreatePostDto extends Dto {
	constructor(
		readonly id: string,
		readonly title: string,
		readonly content: string,
		readonly visibility: PostVisibility,
		readonly attachments: { id: string; path: string }[],
		readonly thread_id: string,
		readonly depth_level: number,
		readonly parent_id: string,
		readonly user_id: string,
		readonly group_id: string,
	) {
		super();
	}
}
