import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { Providers } from './group.provider';

@Module({
    imports: [UserModule, AuthModule],
    providers: [...Providers],
    exports: [...Providers]
})
export class GroupModule {}
