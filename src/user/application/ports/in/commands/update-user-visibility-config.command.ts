import { Command } from 'src/common/core/common.command';
import { UserVisibility } from 'src/user/domain/user-visibility.enum';

export class UpdateUserVisibilityConfigCommand extends Command {
	constructor(
		readonly userId: string,
		readonly profile?: UserVisibility,
		readonly spotFolders?: UserVisibility,
		readonly visitedSpots?: UserVisibility,
		readonly addresses?: UserVisibility,
		readonly posts?: UserVisibility,
		readonly favoriteSpots?: UserVisibility,
		readonly favoriteSpotFolders?: UserVisibility,
		readonly favoriteSpotEvents?: UserVisibility,
	) {
		super();
	}
}
