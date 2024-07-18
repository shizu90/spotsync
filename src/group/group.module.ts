import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { Providers } from './group.provider';
import { GroupController } from './infrastructure/adapters/in/web/group.controller';
import { GroupRoleController } from './infrastructure/adapters/in/web/group-role.controller';
import { GroupMemberController } from './infrastructure/adapters/in/web/group-member.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [UserModule, AuthModule, PrismaModule],
  providers: [...Providers],
  exports: [...Providers],
  controllers: [GroupController, GroupRoleController, GroupMemberController],
})
export class GroupModule {}
