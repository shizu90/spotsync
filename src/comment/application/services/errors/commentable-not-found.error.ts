export class CommentableNotFoundError extends Error {
    constructor(message: string = "Commentable not found.") {
        super(message);
    }
}