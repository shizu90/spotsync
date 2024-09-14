import { MailTemplate } from "../mail-template";

export class NewUserMailTemplate extends MailTemplate {
    public constructor(params: {userName?: string, activationCode?: string}) 
    {
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