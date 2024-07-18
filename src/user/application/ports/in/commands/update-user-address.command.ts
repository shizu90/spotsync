import { Command } from 'src/common/common.command';

export class UpdateUserAddressCommand extends Command {
	constructor(
		readonly id: string,
		readonly userId: string,
		readonly name: string,
		readonly area: string,
		readonly subArea: string,
		readonly locality: string,
		readonly countryCode: string,
		readonly main: boolean,
	) {
		super();
	}
}
