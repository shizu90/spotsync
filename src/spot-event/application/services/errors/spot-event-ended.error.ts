export class SpotEventHasEndedError extends Error {
    constructor(message = "Spot event has already ended.") {
        super(message);
    }
}