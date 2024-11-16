import { Command } from 'src/common/core/common.command';
import { SpotType } from 'src/spot/domain/spot-type.enum';

export class UpdateSpotCommand extends Command {
	constructor(
		readonly id: string,
		readonly name?: string,
		readonly description?: string,
		readonly type?: SpotType,
		readonly address?: {
			area?: string;
			subArea?: string;
			countryCode?: string;
			locality?: string;
			latitude?: number;
			longitude?: number;
			streetNumber?: string;
			postalCode?: string;
		},
	) {
		super();
	}
}
