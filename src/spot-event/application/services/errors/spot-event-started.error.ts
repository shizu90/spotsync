export class SpotEventHasStartedError extends Error {
    constructor(message: string = "Spot event has already started.") {
        super(message);
    }
}