import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { Providers } from './follower.provider';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FollowController } from './infrastructure/adapters/in/web/follow.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [forwardRef(() => UserModule), PrismaModule, AuthModule],
    providers: [...Providers],
    exports: [...Providers],
    controllers: [FollowController]
})
export class FollowerModule {}
