import { MailTemplate } from "../mail-template";

export class NewUserMailTemplate extends MailTemplate {
    public subject(): string {
        return '';
    }
    
    public html(): string {
        return '';
    }
}