import { Module } from '@nestjs/common';
import { Providers } from './mail.provider';

@Module({
	providers: [...Providers],
	exports: [...Providers],
})
export class MailModule {}
