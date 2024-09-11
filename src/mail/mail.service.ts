import { Injectable } from "@nestjs/common";
import { Mail } from "./mail";

@Injectable()
export class MailService extends Mail {
    public async send(): Promise<boolean> {
        return true;
    }
}