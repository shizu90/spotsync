export class LikableNotFoundError extends Error {
    constructor(message = "Likable not found.") {
        super(message);
    }
}