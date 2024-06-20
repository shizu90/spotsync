import { Module } from '@nestjs/common';
import { Providers } from './user.providers';

@Module({
    providers: Providers
})
export class UserModule {}
