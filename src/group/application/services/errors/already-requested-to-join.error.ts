export class AlreadyRequestedToJoinError extends Error {
	constructor(message = "Already requested to join.") {
		super(message);
	}
}
