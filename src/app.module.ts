import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { FollowerModule } from './follower/follower.module';
import { GeolocationModule } from './geolocation/geolocation.module';
import { GroupModule } from './group/group.module';
import { LikeModule } from './like/like.module';
import { MailModule } from './mail/mail.module';
import { PostModule } from './post/post.module';
import { SpotEventModule } from './spot-event/spot-event.module';
import { SpotFolderModule } from './spot-folder/spot-folder.module';
import { SpotModule } from './spot/spot.module';
import { UserModule } from './user/user.module';

@Module({
	imports: [
		UserModule,
		AuthModule,
		FollowerModule,
		GroupModule,
		GeolocationModule,
		PostModule,
		LikeModule,
		SpotModule,
		SpotFolderModule,
		SpotEventModule,
		MailModule,
		CommentModule,
	],
})
export class AppModule {}
