import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { FollowerModule } from 'src/follower/follower.module';
import { GroupModule } from 'src/group/group.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { Providers } from './post.provider';

@Module({
	imports: [PrismaModule, UserModule, GroupModule, FollowerModule, AuthModule],
	providers: [...Providers],
	exports: [...Providers],
})
export class PostModule {}
