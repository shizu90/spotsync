import { FavoriteCommand } from 'src/favorite/application/ports/in/commands/favorite.command';
import { ListFavoritesCommand } from 'src/favorite/application/ports/in/commands/list-favorites.command';
import { FavoritableSubject } from 'src/favorite/domain/favoritable-subject.enum';
import { FavoriteRequest } from '../requests/favorite.request';
import { ListFavoritesQueryRequest } from '../requests/list-favorites-query.request';

export class FavoriteRequestMapper {
	public static favoriteCommand(body: FavoriteRequest): FavoriteCommand {
		return new FavoriteCommand(body.subject, body.subject_id);
	}

	public static unfavoriteCommand(
		subject: FavoritableSubject,
		subject_id: string,
	): FavoriteCommand {
		return new FavoriteCommand(subject, subject_id);
	}

	public static listFavoritesCommand(
		query: ListFavoritesQueryRequest,
	): ListFavoritesCommand {
		return new ListFavoritesCommand(
			query.user_id,
			query.subject,
			query.subject_id,
			query.sort,
			query.sort_direction,
			query.page,
			query.limit,
			query.paginate,
		);
	}
}
