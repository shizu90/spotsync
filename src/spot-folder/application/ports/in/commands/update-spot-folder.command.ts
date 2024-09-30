import { Command } from 'src/common/core/common.command';
import { SpotFolderVisibility } from 'src/spot-folder/domain/spot-folder-visibility.enum';

export class UpdateSpotFolderCommand extends Command {
	constructor(
		readonly id: string,
		readonly name?: string,
		readonly description?: string,
		readonly hexColor?: string,
		readonly visibility?: SpotFolderVisibility,
	) {
		super();
	}
}
