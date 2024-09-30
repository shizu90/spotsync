import { Command } from 'src/common/core/common.command';

export class AddSpotCommand extends Command {
	constructor(
		readonly id: string,
		readonly spotIds: string[],
	) {
		super();
	}
}
