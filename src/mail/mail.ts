import { MailTemplate } from './mail-template';

export const MailProvider = 'Mail';

export abstract class Mail {
	protected _sender: string;
	protected _template: MailTemplate;
	protected _receiver: string;

	public constructor(
		sender?: string,
		receiver?: string,
		template?: MailTemplate,
	) {
		this._sender = sender;
		this._receiver = receiver;
		this._template = template;
	}

	public setSender(sender: string): this {
		this._sender = sender;

		return this;
	}

	public setReceiver(receiver: string): this {
		this._receiver = receiver;

		return this;
	}

	public setTemplate(template: MailTemplate): this {
		this._template = template;

		return this;
	}

	public abstract send(): Promise<boolean>;
}
