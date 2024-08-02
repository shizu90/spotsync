import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { FollowerModule } from './follower/follower.module';
import { GeolocationModule } from './geolocation/geolocation.module';
import { GroupModule } from './group/group.module';
import { LikeModule } from './like/like.module';
import { loadEnvironment } from './load-environment';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: loadEnvironment(),
			isGlobal: true,
		}),
		UserModule,
		AuthModule,
		FollowerModule,
		GroupModule,
		GeolocationModule,
		PostModule,
		LikeModule,
	],
})
export class AppModule {}
