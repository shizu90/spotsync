import { Command } from 'src/common/core/common.command';
import { SpotType } from 'src/spot/domain/spot-type.enum';

export class CreateSpotCommand extends Command {
	constructor(
		readonly name: string,
		readonly type: SpotType,
		readonly address: {
			area: string;
			subArea: string;
			countryCode: string;
			locality?: string;
			latitude?: number;
			longitude?: number;
			streetNumber?: string;
			postalCode?: string;
		},
		readonly description?: string,
		readonly attachments?: Express.Multer.File[],
	) {
		super();
	}
}
