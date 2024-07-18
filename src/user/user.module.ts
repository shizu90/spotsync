import { forwardRef, Module } from '@nestjs/common';
import { Providers } from './user.providers';
import { UserController } from './infrastructure/adapters/in/web/user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { FollowerModule } from 'src/follower/follower.module';
import { UserAddressController } from './infrastructure/adapters/in/web/user-address.controller';
import { GeolocationModule } from 'src/geolocation/geolocation.module';

@Module({
    imports: [PrismaModule, forwardRef(() => AuthModule), forwardRef(() => FollowerModule), GeolocationModule],
    controllers: [UserController, UserAddressController],
    providers: [...Providers],
    exports: [...Providers]
})
export class UserModule {}
