import { Command } from 'src/common/common.command';

export class UpdateUserProfileCommand extends Command {
	constructor(
		readonly id: string,
		readonly firstName?: string,
		readonly lastName?: string,
		readonly profileThemeColor?: string,
		readonly biograph?: string,
		readonly birthDate?: Date,
	) {
		super();
	}
}
