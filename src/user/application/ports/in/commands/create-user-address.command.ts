import { Command } from 'src/common/common.command';

export class CreateUserAddressCommand extends Command {
	constructor(
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
