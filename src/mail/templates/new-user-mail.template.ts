import * as fs from "fs";
import { env } from "process";
import { MailTemplate } from '../mail-template';

type NewUserMailParams = {
	userName?: string;
	userId?: string;
	activationCode?: string;
}

export class NewUserMailTemplate extends MailTemplate<NewUserMailParams> {

	public constructor(params: NewUserMailParams) {
		super();

		this.params = params;
	}

	public subject(): string {
		return 'Spotsync - Activate your account';
	}

	public html(): string {
		const htmlFile = fs.readFileSync('src/mail/templates/new-user-mail.template.html', 'utf8');

		const encryptedCode = Buffer.from(this.params.activationCode).toString('base64');
		const encryptedUserId = Buffer.from(this.params.userId).toString('base64');

		const url = env.FRONTEND_URL + '/user-activation?code=' + encryptedCode + '&userId=' + encryptedUserId;

		return htmlFile
			.replaceAll('$username', this.params.userName)
			.replaceAll('$url', url);
	}
}
