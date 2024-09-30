import { Command } from 'src/common/core/common.command';

export class StartSpotEventCommand extends Command {
	constructor(readonly id: string) {
		super();
	}
}
