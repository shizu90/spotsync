export abstract class MailTemplate<P> {
	protected params: P;

	abstract subject(params?: Object): string;
	abstract html(params?: Object): string;
}
