export abstract class MailTemplate {
    abstract subject(): string
    abstract html(): string
}