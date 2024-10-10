import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { CacheModule } from 'src/cache/cache.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { Providers } from './follower.provider';
import { FollowController } from './infrastructure/adapters/in/web/follow.controller';

@Module({
	imports: [
		forwardRef(() => UserModule),
		PrismaModule,
		CacheModule,
		forwardRef(() => AuthModule),
	],
	providers: [...Providers],
	exports: [...Providers],
	controllers: [FollowController],
})
export class FollowerModule {}
