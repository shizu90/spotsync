import * as fs from "fs";
import { env } from "process";
import { MailTemplate } from '../mail-template';

type NewUserMailParams = {
	userName?: string;
	activationCode?: string;
}

export class NewUserMailTemplate extends MailTemplate {
	private _params: NewUserMailParams;

	public constructor(params: NewUserMailParams) {
		super();

		this._params = params;
	}

	public subject(): string {
		return 'Spotsync - Activate your account';
	}

	public html(): string {
		const htmlFile = fs.readFileSync('src/mail/templates/new-user-mail.template.html', 'utf8');

		const encryptedCode = Buffer.from(this._params.activationCode).toString('base64');

		const url = env.FRONTEND_URL + '/user-activation?code=' + encryptedCode;

		return htmlFile
			.replaceAll('$username', this._params.userName)
			.replaceAll('$url', url);
	}
}
