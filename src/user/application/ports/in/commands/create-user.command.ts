import { Command } from 'src/common/core/common.command';

export class CreateUserCommand extends Command {
	constructor(
		readonly birthDate: Date,
		readonly name: string,
		readonly email: string,
		readonly password: string,
		readonly phoneNumber?: string,
		readonly address?: {
			area: string;
			subArea: string;
			countryCode: string;
			locality?: string;
			latitude?: number;
			longitude?: number;
		},
	) {
		super();
	}
}
