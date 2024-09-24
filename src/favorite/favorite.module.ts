import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { FollowerModule } from 'src/follower/follower.module';
import { SpotEventModule } from 'src/spot-event/spot-event.module';
import { SpotFolderModule } from 'src/spot-folder/spot-folder.module';
import { SpotModule } from 'src/spot/spot.module';
import { Providers } from './favorite.provider';
import { FavoriteController } from './infrastructure/adapters/in/web/favorite.controller';

@Module({
    imports: [SpotModule, SpotFolderModule, SpotEventModule, AuthModule, FollowerModule],
    exports: [...Providers],
    providers: [...Providers],
    controllers: [FavoriteController],
})
export class FavoriteModule {}
