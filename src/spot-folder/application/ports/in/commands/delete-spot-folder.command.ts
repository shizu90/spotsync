import { Command } from 'src/common/core/common.command';

export class DeleteSpotFolderCommand extends Command {
	constructor(readonly id: string) {
		super();
	}
}
