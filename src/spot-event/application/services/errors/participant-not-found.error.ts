export class ParticipantNotFoundError extends Error {
    constructor(message = "Participant not found.") {
        super(message);
    }
}