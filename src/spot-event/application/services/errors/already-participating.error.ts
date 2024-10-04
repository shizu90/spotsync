export class AlreadyParticipatingError extends Error {
    constructor(message: string = "You are already participating in this event.") {
        super(message);
    }
}