import { Command } from 'src/common/core/common.command';
import { FavoritableSubject } from 'src/favorite/domain/favoritable-subject.enum';

export class FavoriteCommand extends Command {
	constructor(
		readonly subject: FavoritableSubject,
		readonly subjectId: string,
	) {
		super();
	}
}
