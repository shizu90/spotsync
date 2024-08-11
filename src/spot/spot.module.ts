import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { FollowerModule } from 'src/follower/follower.module';
import { GeolocationModule } from 'src/geolocation/geolocation.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { SpotController } from './infrastructure/adapters/in/web/spot.controller';
import { Providers } from './spot.provider';

@Module({
	providers: [...Providers],
	exports: [...Providers],
	imports: [
		UserModule,
		AuthModule,
		FollowerModule,
		GeolocationModule,
		PrismaModule,
	],
	controllers: [SpotController],
})
export class SpotModule {}
