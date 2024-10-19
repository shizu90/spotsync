export class InvalidSubjectError extends Error {
    constructor(message: string = 'Invalid subject') {
        super(message);
    }
}