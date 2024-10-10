import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { CacheModule } from 'src/cache/cache.module';
import { FollowerModule } from 'src/follower/follower.module';
import { GroupModule } from 'src/group/group.module';
import { LikeModule } from 'src/like/like.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { PostThreadController } from './infrastructure/adapters/in/web/post-thread.controller';
import { PostController } from './infrastructure/adapters/in/web/post.controller';
import { Providers } from './post.provider';

@Module({
	imports: [
		PrismaModule,
		CacheModule,
		UserModule,
		GroupModule,
		FollowerModule,
		forwardRef(() => LikeModule),
		AuthModule,
	],
	providers: [...Providers],
	exports: [...Providers],
	controllers: [PostController, PostThreadController],
})
export class PostModule {}
