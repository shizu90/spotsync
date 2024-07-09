import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { FollowerModule } from './follower/follower.module';

@Module({
  imports: [UserModule, AuthModule, FollowerModule],
})
export class AppModule {}
