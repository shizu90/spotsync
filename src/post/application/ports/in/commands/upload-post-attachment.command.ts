import { Command } from 'src/common/core/common.command';

export class UploadPostAttachmentCommand extends Command {
	constructor(
		readonly postId: string,
		readonly attachment: Blob,
	) {
		super();
	}
}
