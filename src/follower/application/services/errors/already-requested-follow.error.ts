export class AlreadyRequestedFollowError extends Error {
	constructor(message = "Already requested follow.") {
		super(message);
	}
}
