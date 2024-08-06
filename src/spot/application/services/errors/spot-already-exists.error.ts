export class SpotAlreadyExistsError extends Error {
	constructor(message: string) {
		super(message);
	}
}
