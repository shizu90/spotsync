import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { Providers } from './like.provider';

@Module({
	imports: [AuthModule, PrismaModule],
	providers: [...Providers],
	exports: [...Providers],
})
export class LikeModule {}
