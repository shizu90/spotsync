import { Command } from 'src/common/core/common.command';

export class JoinGroupCommand extends Command {
	constructor(readonly id: string) {
		super();
	}
}
