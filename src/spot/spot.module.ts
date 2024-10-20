import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { CacheModule } from 'src/cache/cache.module';
import { FavoriteModule } from 'src/favorite/favorite.module';
import { FollowerModule } from 'src/follower/follower.module';
import { GeolocationModule } from 'src/geolocation/geolocation.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RatingModule } from 'src/rating/rating.module';
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
		forwardRef(() => RatingModule)
	],
	controllers: [SpotController],
})
export class SpotModule {}
