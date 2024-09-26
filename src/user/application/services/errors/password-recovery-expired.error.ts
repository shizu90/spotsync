export class PasswordRecoveryExpired extends Error {
    constructor(message = "Password recovery request expired.") {
        super(message);
        this.name = "PasswordRecoveryExpired";
    }
}