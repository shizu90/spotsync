import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { Providers } from './like.provider';

@Module({
    imports: [AuthModule],
    providers: [...Providers],
    exports: [...Providers]
})
export class LikeModule {}
