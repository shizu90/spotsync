export class SpotFolderNotFoundError extends Error {
	constructor(message = 'Spot folder not found.') {
		super(message);
	}
}
