import { Command } from 'src/common/core/common.command';

export class DeleteSpotEventCommand extends Command {
	constructor(readonly id: string) {
		super();
	}
}
