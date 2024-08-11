import { Command } from 'src/common/core/common.command';

export class UnvisitSpotCommand extends Command {
	constructor(readonly id: string) {
		super();
	}
}
