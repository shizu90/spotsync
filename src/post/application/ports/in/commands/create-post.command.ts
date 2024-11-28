import { Command } from 'src/common/core/common.command';
import { PostVisibility } from 'src/post/domain/post-visibility.enum';

export class CreatePostCommand extends Command {
	constructor(
		readonly title: string,
		readonly content: string,
		readonly visibility?: PostVisibility,
		readonly parentId?: string,
		readonly groupId?: string,
		readonly attachments?: Express.Multer.File[],
	) {
		super();
	}
}
