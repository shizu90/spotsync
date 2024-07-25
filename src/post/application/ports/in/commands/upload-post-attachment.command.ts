import { Command } from 'src/common/common.command';

export class UploadPostAttachmentCommand extends Command {
	constructor(
		readonly postId: string,
		readonly attachment: Blob,
	) {
		super();
	}
}
