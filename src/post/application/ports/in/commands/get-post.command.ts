import { Command } from 'src/common/core/common.command';

export class GetPostCommand extends Command {
	constructor(
		readonly id: string,
		readonly maxDepthLevel?: number,
	) {
		super();
	}
}
