export class SpotNotFoundError extends Error {
	constructor(message = "Spot not found.") {
		super(message);
	}
}
