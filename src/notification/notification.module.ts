import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { CacheModule } from 'src/cache/cache.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { NotificationController } from './infrastructure/adapters/in/web/notification.controller';
import { Providers } from './notification.provider';

@Module({
    imports: [PrismaModule, CacheModule, UserModule, AuthModule],
    providers: [...Providers],
    exports: [...Providers],
    controllers: [NotificationController],
})
export class NotificationModule {}
