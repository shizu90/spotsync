import { Command } from 'src/common/core/common.command';

export class GetUserAddressCommand extends Command {
	constructor(
		readonly id: string,
		readonly userId: string,
	) {
		super();
	}
}
