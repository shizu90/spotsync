import { Module } from '@nestjs/common';
import { Providers } from './user.providers';
import { UserController } from './infrastructure/adapters/in/web/user.controller';

@Module({
    controllers: [UserController],
    providers: [...Providers]
})
export class UserModule {}
