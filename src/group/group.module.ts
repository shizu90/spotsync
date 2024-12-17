import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { CacheModule } from 'src/cache/cache.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FileStorageServices } from 'src/storage/file-storage-services.enum';
import { StorageModule } from 'src/storage/storage.module';
import { UserModule } from 'src/user/user.module';
import { Providers } from './group.provider';
import { GroupMemberController } from './infrastructure/adapters/in/web/group-member.controller';
import { GroupRoleController } from './infrastructure/adapters/in/web/group-role.controller';
import { GroupController } from './infrastructure/adapters/in/web/group.controller';

@Module({
	imports: [
		UserModule, 
		AuthModule, 
		PrismaModule, 
		CacheModule, 
		StorageModule.forService(FileStorageServices.LOCAL)
	],
	providers: [...Providers],
	exports: [...Providers],
	controllers: [GroupController, GroupRoleController, GroupMemberController],
})
export class GroupModule {}
