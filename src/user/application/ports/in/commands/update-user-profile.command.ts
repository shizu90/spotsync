import { Command } from 'src/common/core/common.command';

export class UpdateUserProfileCommand extends Command {
	constructor(
		readonly id: string,
		readonly displayName?: string,
		readonly themeColor?: string,
		readonly biograph?: string,
		readonly birthDate?: Date,
		readonly profilePicture?: Express.Multer.File,
		readonly bannerPicture?: Express.Multer.File,
	) {
		super();
	}
}
