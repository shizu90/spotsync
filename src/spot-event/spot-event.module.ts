import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { CacheModule } from 'src/cache/cache.module';
import { FavoriteModule } from 'src/favorite/favorite.module';
import { GroupModule } from 'src/group/group.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RatingModule } from 'src/rating/rating.module';
import { SpotModule } from 'src/spot/spot.module';
import { SpotEventController } from './infrastructure/adapters/in/web/spot-event.controller';
import { Providers } from './spot-event.provider';

@Module({
    providers: [...Providers],
    exports: [...Providers],
    imports: [PrismaModule, CacheModule, AuthModule, SpotModule, GroupModule, forwardRef(() => FavoriteModule), forwardRef(() => RatingModule)],
    controllers: [SpotEventController],
})
export class SpotEventModule {}
