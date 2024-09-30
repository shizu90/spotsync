export class InvalidActivationCodeError extends Error {
	constructor(message = 'Invalid activation code.') {
		super(message);
	}
}
