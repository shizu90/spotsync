import { Command } from 'src/common/common.command';

export class AddPostAttachmentCommand extends Command {
	constructor(
		readonly file: Blob,
		readonly file_type: string,
		readonly postId: string,
	) {
		super();
	}
}
