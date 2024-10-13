import { Module } from '@nestjs/common';
import { CacheModule } from 'src/cache/cache.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    imports: [PrismaModule, CacheModule]
})
export class NotificationModule {}
