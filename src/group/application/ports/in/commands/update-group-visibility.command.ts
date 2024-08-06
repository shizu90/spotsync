import { Command } from 'src/common/core/common.command';
import { GroupVisibility } from 'src/group/domain/group-visibility.enum';

export class UpdateGroupVisibilityCommand extends Command {
	constructor(
		readonly id: string,
		readonly groups?: GroupVisibility,
		readonly posts?: GroupVisibility,
		readonly spotEvents?: GroupVisibility,
	) {
		super();
	}
}
