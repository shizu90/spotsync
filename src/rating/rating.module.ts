import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { CacheModule } from 'src/cache/cache.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SpotEventModule } from 'src/spot-event/spot-event.module';
import { SpotFolderModule } from 'src/spot-folder/spot-folder.module';
import { SpotModule } from 'src/spot/spot.module';
import { RatingController } from './infrastructure/adapters/in/rating.controller';
import { Providers } from './rating.provider';

@Module({
    imports: [
        AuthModule,
        CacheModule,
        PrismaModule,
        forwardRef(() => SpotModule),
        forwardRef(() => SpotEventModule),
        forwardRef(() => SpotFolderModule),
    ],
    exports: [...Providers],
    providers: [...Providers],
    controllers: [RatingController]
})
export class RatingModule {}
