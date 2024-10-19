export class AlreadyRatedError extends Error {
    constructor(message: string = 'You have already rated this subject') {
        super(message);
    }
}