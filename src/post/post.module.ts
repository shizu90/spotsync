import { forwardRef, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { CacheModule } from 'src/cache/cache.module';
import { SignedUrlMiddleware } from 'src/common/web/middlewares/signed-url.middleware';
import { FollowerModule } from 'src/follower/follower.module';
import { GroupModule } from 'src/group/group.module';
import { LikeModule } from 'src/like/like.module';
import { NotificationModule } from 'src/notification/notification.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FileStorageServices } from 'src/storage/file-storage-services.enum';
import { StorageModule } from 'src/storage/storage.module';
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
		NotificationModule,
		StorageModule.forService(FileStorageServices.LOCAL),
	],
	providers: [...Providers],
	exports: [...Providers],
	controllers: [PostController, PostThreadController],
})
export class PostModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(
			SignedUrlMiddleware
		).forRoutes(
			'posts/:postId/attachments/:attachmentId'
		);
	}
}
