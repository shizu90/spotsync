export class PasswordRecoveryExpired extends Error {
    constructor(message) {
        super(message);
        this.name = "PasswordRecoveryExpired";
    }
}