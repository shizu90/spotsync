export class SpotNotAddedError extends Error {
	constructor(message = 'Spot not in folder.') {
		super(message);
	}
}
