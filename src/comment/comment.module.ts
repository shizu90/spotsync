import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { CacheModule } from 'src/cache/cache.module';
import { LikeModule } from 'src/like/like.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SpotEventModule } from 'src/spot-event/spot-event.module';
import { SpotModule } from 'src/spot/spot.module';
import { Providers } from './comment.provider';
import { CommentController } from './infrastructure/adapters/in/web/comment.controller';

@Module({
	imports: [SpotModule, SpotEventModule, LikeModule, AuthModule, PrismaModule, CacheModule],
	exports: [...Providers],
	providers: [...Providers],
	controllers: [CommentController],
})
export class CommentModule {}
