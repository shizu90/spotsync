import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { FollowerModule } from './follower/follower.module';
import { GroupModule } from './group/group.module';

@Module({
  imports: [UserModule, AuthModule, FollowerModule, GroupModule],
})
export class AppModule {}
