export class AlreadyRequestedPasswordRecoveryError extends Error {
    constructor(message = "Already requested a password recovery.") {
        super(message);
    }
}