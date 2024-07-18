import { Command } from 'src/common/common.command';

export class GetGroupCommand extends Command {
	constructor(readonly id: string) {
		super();
	}
}
