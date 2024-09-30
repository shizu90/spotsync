import { MailTemplate } from '../mail-template';

export class ForgotPasswordMailTemplate extends MailTemplate {
	public constructor(params: {
		email?: string;
		token?: string;
		userName?: string;
	}) {
		super();
		this.params = params;
	}

	public subject(): string {
		return '';
	}

	public html(): string {
		return '';
	}
}
