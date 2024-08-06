import { Command } from 'src/common/core/common.command';

export class UploadProfilePictureCommand extends Command {
	constructor(
		readonly id: string,
		readonly profilePicture: Blob,
	) {
		super();
	}
}
