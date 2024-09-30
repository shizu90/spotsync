import { Module } from '@nestjs/common';
import { LikeModule } from 'src/like/like.module';
import { SpotEventModule } from 'src/spot-event/spot-event.module';
import { SpotModule } from 'src/spot/spot.module';
import { Providers } from './comment.provider';
import { CommentController } from './infrastructure/adapters/in/web/comment.controller';

@Module({
	imports: [SpotModule, SpotEventModule, LikeModule],
	exports: [...Providers],
	providers: [...Providers],
	controllers: [CommentController],
})
export class CommentModule {}
