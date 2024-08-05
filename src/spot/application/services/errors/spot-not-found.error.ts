export class SpotNotFoundError extends Error {
    constructor(message: string) {
        super(message);
    }
}