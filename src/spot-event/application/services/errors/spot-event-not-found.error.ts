export class SpotEventNotFoundError extends Error {
    constructor(message: string = "Spot Event not found.") {
        super(message);
    }
}