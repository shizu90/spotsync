export class CommentNotFoundError extends Error {
    constructor(message: string = "Comment not found.") {
        super(message);
    }
}