import { Command } from 'src/common/core/common.command';

export class GetUserCommand extends Command {
	constructor(
		readonly id?: string,
		readonly name?: string,
	) {
		super();
	}
}
