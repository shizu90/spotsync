import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { CacheModule } from 'src/cache/cache.module';
import { FavoriteModule } from 'src/favorite/favorite.module';
import { FollowerModule } from 'src/follower/follower.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RatingModule } from 'src/rating/rating.module';
import { SpotModule } from 'src/spot/spot.module';
import { SpotFolderController } from './infrastructure/adapters/in/web/spot-folder.controller';
import { Providers } from './spot-folder.provider';

@Module({
	imports: [
		AuthModule,
		FollowerModule,
		forwardRef(() => SpotModule),
		PrismaModule,
		CacheModule,
		forwardRef(() => FavoriteModule),
		forwardRef(() => RatingModule),
	],
	exports: [...Providers],
	providers: [...Providers],
	controllers: [SpotFolderController],
})
export class SpotFolderModule {}
