import { Command } from 'src/common/core/common.command';

export class CreateGroupCommand extends Command {
	constructor(
		readonly name: string,
		readonly about: string,
		readonly groupPicture?: Express.Multer.File,
		readonly bannerPicture?: Express.Multer.File,
	) {
		super();
	}
}
