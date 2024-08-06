import { Command } from 'src/common/core/common.command';

export class DeleteSpotCommand extends Command {
	constructor(readonly id: string) {
		super();
	}
}
