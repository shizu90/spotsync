export class FavoriteNotFoundError extends Error {
	constructor(message = 'Favorite not found.') {
		super(message);
	}
}
