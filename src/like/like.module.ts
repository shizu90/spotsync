import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { CacheModule } from 'src/cache/cache.module';
import { CommentModule } from 'src/comment/comment.module';
import { PostModule } from 'src/post/post.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LikeController } from './infrastructure/adapters/in/web/like.controller';
import { Providers } from './like.provider';

@Module({
	imports: [AuthModule, PrismaModule, CacheModule, forwardRef(() => PostModule), forwardRef(() => CommentModule)],
	providers: [...Providers],
	exports: [...Providers],
	controllers: [LikeController],
})
export class LikeModule {}
