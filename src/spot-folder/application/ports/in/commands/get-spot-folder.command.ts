import { Command } from 'src/common/core/common.command';

export class GetSpotFolderCommand extends Command {
	constructor(readonly id: string) {
		super();
	}
}
