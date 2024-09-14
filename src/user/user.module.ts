import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { FollowerModule } from 'src/follower/follower.module';
import { GeolocationModule } from 'src/geolocation/geolocation.module';
import { MailModule } from 'src/mail/mail.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PasswordRecoveryController } from './infrastructure/adapters/in/web/password-recovery.controller';
import { UserAddressController } from './infrastructure/adapters/in/web/user-address.controller';
import { UserController } from './infrastructure/adapters/in/web/user.controller';
import { Providers } from './user.providers';

@Module({
	imports: [
		PrismaModule,
		forwardRef(() => AuthModule),
		forwardRef(() => FollowerModule),
		GeolocationModule,
		MailModule,
	],
	controllers: [UserController, UserAddressController, PasswordRecoveryController],
	providers: [...Providers],
	exports: [...Providers],
})
export class UserModule {}
