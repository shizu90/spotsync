import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { FollowerModule } from './follower/follower.module';
import { GroupModule } from './group/group.module';
import { GeolocationModule } from './geolocation/geolocation.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    FollowerModule,
    GroupModule,
    GeolocationModule,
  ],
})
export class AppModule {}
