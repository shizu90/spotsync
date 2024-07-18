import { Command } from 'src/common/common.command';

export class JoinGroupCommand extends Command {
	constructor(readonly id: string) {
		super();
	}
}
