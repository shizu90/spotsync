import { Dto } from 'src/common/common.dto';

export class AddPostAttachmentDto extends Dto {
	constructor(
		readonly id: string,
		readonly post_id: string,
		readonly file_path: string,
		readonly file_type: string,
	) {
		super();
	}
}
