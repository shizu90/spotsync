import { Command } from 'src/common/core/common.command';

export class GetSpotCommand extends Command {
	constructor(readonly id: string) {
		super();
	}
}
