import { Command } from 'src/common/core/common.command';

export class CancelSpotEventCommand extends Command {
	constructor(readonly id: string) {
		super();
	}
}
