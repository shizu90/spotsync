import * as fs from 'fs';
import { env } from 'process';
import { MailTemplate } from '../mail-template';

type ForgotPasswordMailParams = {
	email?: string;
	token?: string;
	userName?: string;
}

export class ForgotPasswordMailTemplate extends MailTemplate<ForgotPasswordMailParams> {
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
		const htmlFile = fs.readFileSync('src/mail/templates/forgot-password-mail.template.html', 'utf8');

		const encryptedCode = Buffer.from(this.params.token).toString('base64');

		const url = env.FRONTEND_URL + '/reset-password?token=' + encryptedCode;

		return htmlFile
			.replaceAll('$username', this.params.userName)
			.replaceAll('$url', url);
	}
}
