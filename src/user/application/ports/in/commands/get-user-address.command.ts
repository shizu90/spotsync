import { Command } from 'src/common/common.command';

export class GetUserAddressCommand extends Command {
	constructor(
		readonly userId: string,
		readonly id: string,
	) {
		super();
	}
}
