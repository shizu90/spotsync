import { Command } from 'src/common/core/common.command';

export class UploadBannerPictureCommand extends Command {
	constructor(
		readonly id: string,
		readonly bannerPicture: Blob,
	) {
		super();
	}
}
