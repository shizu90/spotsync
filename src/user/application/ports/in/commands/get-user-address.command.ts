import { Command } from 'src/common/common.command';

export class GetUserAddressCommand extends Command {
	constructor(
		readonly id: string,
		readonly userId: string,
	) {
		super();
	}
}
