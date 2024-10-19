export class RatingNotFoundError extends Error {
    constructor(message: string = "Rating not found") {
        super(message);
    }
}