export class LikableNotFoundError extends Error {
    constructor(message: string = 'Likable not found') {
        super(message);
    }
}