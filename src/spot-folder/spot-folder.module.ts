import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { FavoriteModule } from 'src/favorite/favorite.module';
import { FollowerModule } from 'src/follower/follower.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SpotModule } from 'src/spot/spot.module';
import { SpotFolderController } from './infrastructure/adapters/in/web/spot-folder.controller';
import { Providers } from './spot-folder.provider';

@Module({
	imports: [
		AuthModule,
		FollowerModule,
		SpotModule,
		PrismaModule,
		forwardRef(() => FavoriteModule),
	],
	exports: [...Providers],
	providers: [...Providers],
	controllers: [SpotFolderController],
})
export class SpotFolderModule {}
