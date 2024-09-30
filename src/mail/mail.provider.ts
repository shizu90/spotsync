import { Provider } from '@nestjs/common';
import { MailProvider } from './mail';
import { MailService } from './mail.service';

export const Providers: Provider[] = [
	{
		provide: MailProvider,
		useClass: MailService,
	},
];
