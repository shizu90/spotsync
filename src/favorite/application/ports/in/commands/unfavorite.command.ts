import { Command } from 'src/common/core/common.command';

export class UnfavoriteCommand extends Command {
	constructor(
		readonly subject: string,
		readonly subjectId: string,
	) {
		super();
	}
}
