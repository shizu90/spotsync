import { Injectable } from "@nestjs/common";
import { Mail } from "./mail";
import { MailError } from "./mail.error";

@Injectable()
export class MailService extends Mail {
    public async send(): Promise<boolean> {
        throw new MailError("Method not implemented.");
    }
}