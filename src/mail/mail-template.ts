export abstract class MailTemplate {
    protected params: Object;

    abstract subject(params?: Object): string
    abstract html(params?: Object): string
}