export class SpotAlreadyExistsError extends Error {
	constructor(message = 'Spot already exists.') {
		super(message);
	}
}
