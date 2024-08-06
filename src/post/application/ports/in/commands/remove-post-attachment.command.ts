import { Command } from 'src/common/core/common.command';

export class RemovePostAttachmentCommand extends Command {
	constructor(
		readonly id: string,
		readonly postId: string,
	) {
		super();
	}
}
