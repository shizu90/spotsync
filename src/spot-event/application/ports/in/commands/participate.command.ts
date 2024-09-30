import { Command } from 'src/common/core/common.command';

export class ParticipateCommand extends Command {
	constructor(readonly id: string) {
		super();
	}
}
