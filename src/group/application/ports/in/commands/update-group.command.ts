import { Command } from 'src/common/core/common.command';

export class UpdateGroupCommand extends Command {
	constructor(
		readonly id: string,
		readonly name?: string,
		readonly about?: string,
		readonly groupPicture?: Express.Multer.File,
		readonly bannerPicture?: Express.Multer.File,
	) {
		super();
	}
}
