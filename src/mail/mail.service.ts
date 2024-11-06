import { Injectable } from '@nestjs/common';
import * as nodemailer from "nodemailer";
import { env } from 'process';
import { Mail } from './mail';

@Injectable()
export class MailService extends Mail {
	private _transporter: nodemailer.Transporter;

	public constructor() {
		super(
			env.MAIL_DEFAULT_SENDER
		);
		this._transporter = nodemailer.createTransport({
			host: env.MAILHOG_HOST,
			port: parseInt(env.MAILHOG_PORT),
			auth: null,
		});
	}

	public async send(): Promise<boolean> {
		try {
			this._transporter.sendMail({
				from: this._sender,
				to: this._receiver,
				subject: this._template.subject(),
				html: this._template.html(),
			});

			return true;
		} catch (error) {
			return false;
		}
	}
}
