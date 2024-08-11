import { Command } from 'src/common/core/common.command';

export class FavoriteSpotCommand extends Command {
	constructor(readonly id: string) {
		super();
	}
}
