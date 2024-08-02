import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { env } from 'process';
import { UserModule } from 'src/user/user.module';
import { Providers } from './auth.providers';
import { AuthController } from './infrastructure/adapters/in/web/auth.controller';

@Module({
	imports: [
		forwardRef(() => UserModule),
		JwtModule.register({
			global: true,
			secret: env.JWT_SECRET,
			signOptions: { expiresIn: env.JWT_EXPIRATION_TIME },
		}),
	],
	providers: [...Providers],
	controllers: [AuthController],
	exports: [...Providers],
})
export class AuthModule {}
