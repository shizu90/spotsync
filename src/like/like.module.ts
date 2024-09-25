import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PostModule } from 'src/post/post.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LikeController } from './infrastructure/adapters/in/web/like.controller';
import { Providers } from './like.provider';

@Module({
	imports: [AuthModule, PrismaModule, forwardRef(() => PostModule)],
	providers: [...Providers],
	exports: [...Providers],
	controllers: [LikeController],
})
export class LikeModule {}
