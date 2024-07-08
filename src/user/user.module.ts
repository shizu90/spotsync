import { Module } from '@nestjs/common';
import { Providers } from './user.providers';
import { UserController } from './infrastructure/adapters/in/web/user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [UserController],
    providers: [...Providers],
    exports: [...Providers]
})
export class UserModule {}
