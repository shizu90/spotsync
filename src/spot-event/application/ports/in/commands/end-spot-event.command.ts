import { Command } from 'src/common/core/common.command';

export class EndSpotEventCommand extends Command {
	constructor(readonly id: string) {
		super();
	}
}
