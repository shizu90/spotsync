import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { CacheModule } from 'src/cache/cache.module';
import { FollowerModule } from 'src/follower/follower.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SpotEventModule } from 'src/spot-event/spot-event.module';
import { SpotFolderModule } from 'src/spot-folder/spot-folder.module';
import { SpotModule } from 'src/spot/spot.module';
import { UserModule } from 'src/user/user.module';
import { Providers } from './favorite.provider';
import { FavoriteController } from './infrastructure/adapters/in/web/favorite.controller';

@Module({
	imports: [
		forwardRef(() => SpotModule),
		forwardRef(() => SpotFolderModule),
		forwardRef(() => SpotEventModule),
		AuthModule,
		FollowerModule,
		UserModule,
		PrismaModule,
		CacheModule,
	],
	exports: [...Providers],
	providers: [...Providers],
	controllers: [FavoriteController],
})
export class FavoriteModule {}
