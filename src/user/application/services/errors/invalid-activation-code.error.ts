export class InvalidActivationCodeError extends Error {
    constructor(message) {
        super(message);
        this.name = "InvalidActivationCode";
    }
}