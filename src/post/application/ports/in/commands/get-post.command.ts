import { Command } from 'src/common/common.command';

export class GetPostCommand extends Command {
	constructor(
		readonly id: string,
		readonly maxDepthLevel?: number,
	) {
		super();
	}
}
