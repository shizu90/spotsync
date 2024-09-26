export class SpotAlreadyAddedError extends Error {
    constructor(message = "Spot already added.") {
        super(message);
    }
}