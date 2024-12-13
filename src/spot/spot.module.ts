import { forwardRef, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { CacheModule } from 'src/cache/cache.module';
import { SignedUrlMiddleware } from 'src/common/web/middlewares/signed-url.middleware';
import { FavoriteModule } from 'src/favorite/favorite.module';
import { FollowerModule } from 'src/follower/follower.module';
import { GeolocationModule } from 'src/geolocation/geolocation.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RatingModule } from 'src/rating/rating.module';
import { FileStorageServices } from 'src/storage/file-storage-services.enum';
import { StorageModule } from 'src/storage/storage.module';
import { UserModule } from 'src/user/user.module';
import { SpotController } from './infrastructure/adapters/in/web/spot.controller';
import { Providers } from './spot.provider';

@Module({
	providers: [...Providers],
	exports: [...Providers],
	imports: [
		UserModule,
		AuthModule,
		FollowerModule,
		GeolocationModule,
		PrismaModule,
		CacheModule,
		forwardRef(() => FavoriteModule),
		forwardRef(() => RatingModule),
		StorageModule.forService(FileStorageServices.LOCAL)
	],
	controllers: [SpotController],
})
export class SpotModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(
			SignedUrlMiddleware
		).forRoutes(
			`spots/:id/attachments/:attachmentId`
		);
	}
}
