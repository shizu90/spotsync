import { Provider } from '@nestjs/common';
import { AcceptGroupRequestUseCaseProvider } from './application/ports/in/use-cases/accept-group-request.use-case';
import { ChangeMemberRoleUseCaseProvider } from './application/ports/in/use-cases/change-member-role.use-case';
import { CreateGroupRoleUseCaseProvider } from './application/ports/in/use-cases/create-group-role.use-case';
import { CreateGroupUseCaseProvider } from './application/ports/in/use-cases/create-group.use-case';
import { DeleteGroupUseCaseProvider } from './application/ports/in/use-cases/delete-group.use-case';
import { GetGroupBannerPictureUseCaseProvider } from './application/ports/in/use-cases/get-group-banner-picture.use-case';
import { GetGroupHistoryUseCaseProvider } from './application/ports/in/use-cases/get-group-history.use-case';
import { GetGroupPictureUseCaseProvider } from './application/ports/in/use-cases/get-group-picture.use-case';
import { GetGroupRoleUseCaseProvider } from './application/ports/in/use-cases/get-group-role.use-case';
import { GetGroupUseCaseProvider } from './application/ports/in/use-cases/get-group.use-case';
import { JoinGroupUseCaseProvider } from './application/ports/in/use-cases/join-group.use-case';
import { LeaveGroupUseCaseProvider } from './application/ports/in/use-cases/leave-group.use-case';
import { ListGroupMembersUseCaseProvider } from './application/ports/in/use-cases/list-group-members.use-case';
import { ListGroupRolesUseCaseProvider } from './application/ports/in/use-cases/list-group-roles.use-case';
import { ListGroupsUseCaseProvider } from './application/ports/in/use-cases/list-groups.use-case';
import { RefuseGroupRequestUseCaseProvider } from './application/ports/in/use-cases/refuse-group-request.use-case';
import { RemoveGroupMemberUseCaseProvider } from './application/ports/in/use-cases/remove-group-member.use-case';
import { RemoveGroupRoleUseCaseProvider } from './application/ports/in/use-cases/remove-group-role.use-case';
import { UpdateGroupRoleUseCaseProvider } from './application/ports/in/use-cases/update-group-role.use-case';
import { UpdateGroupVisibilityUseCaseProvider } from './application/ports/in/use-cases/update-group-visibility.use-case';
import { UpdateGroupUseCaseProvider } from './application/ports/in/use-cases/update-group.use-case';
import { GroupMemberRepositoryProvider } from './application/ports/out/group-member.repository';
import { GroupRoleRepositoryProvider } from './application/ports/out/group-role.repository';
import { GroupRepositoryProvider } from './application/ports/out/group.repository';
import { AcceptGroupRequestService } from './application/services/accept-group-request.service';
import { ChangeMemberRoleService } from './application/services/change-member-role.service';
import { CreateGroupRoleService } from './application/services/create-group-role.service';
import { CreateGroupService } from './application/services/create-group.service';
import { DeleteGroupService } from './application/services/delete-group.service';
import { GetGroupBannerPictureService } from './application/services/get-group-banner-picture.service';
import { GetGroupHistoryService } from './application/services/get-group-history.service';
import { GetGroupPictureService } from './application/services/get-group-picture.service';
import { GetGroupRoleService } from './application/services/get-group-role.service';
import { GetGroupService } from './application/services/get-group.service';
import { JoinGroupService } from './application/services/join-group.service';
import { LeaveGroupService } from './application/services/leave-group.service';
import { ListGroupMembersService } from './application/services/list-group-members.service';
import { ListGroupRolesService } from './application/services/list-group-roles.service';
import { ListGroupsService } from './application/services/list-groups.service';
import { RefuseGroupRequestService } from './application/services/refuse-group-request.service';
import { RemoveGroupMemberService } from './application/services/remove-group-member.service';
import { RemoveGroupRoleService } from './application/services/remove-group-role.service';
import { UpdateGroupRoleService } from './application/services/update-group-role.service';
import { UpdateGroupVisibilityService } from './application/services/update-group-visibility.service';
import { UpdateGroupService } from './application/services/update-group.service';
import { GroupMemberRepositoryImpl } from './infrastructure/adapters/out/group-member.db';
import { GroupRoleRepositoryImpl } from './infrastructure/adapters/out/group-role.db';
import { GroupRepositoryImpl } from './infrastructure/adapters/out/group.db';

export const Providers: Provider[] = [
	{
		provide: GetGroupUseCaseProvider,
		useClass: GetGroupService,
	},
	{
		provide: ListGroupsUseCaseProvider,
		useClass: ListGroupsService,
	},
	{
		provide: GetGroupHistoryUseCaseProvider,
		useClass: GetGroupHistoryService,
	},
	{
		provide: CreateGroupUseCaseProvider,
		useClass: CreateGroupService,
	},
	{
		provide: UpdateGroupUseCaseProvider,
		useClass: UpdateGroupService,
	},
	{
		provide: UpdateGroupVisibilityUseCaseProvider,
		useClass: UpdateGroupVisibilityService,
	},
	{
		provide: DeleteGroupUseCaseProvider,
		useClass: DeleteGroupService,
	},
	{
		provide: ListGroupMembersUseCaseProvider,
		useClass: ListGroupMembersService,
	},
	{
		provide: AcceptGroupRequestUseCaseProvider,
		useClass: AcceptGroupRequestService,
	},
	{
		provide: RefuseGroupRequestUseCaseProvider,
		useClass: RefuseGroupRequestService,
	},
	{
		provide: JoinGroupUseCaseProvider,
		useClass: JoinGroupService,
	},
	{
		provide: LeaveGroupUseCaseProvider,
		useClass: LeaveGroupService,
	},
	{
		provide: RemoveGroupMemberUseCaseProvider,
		useClass: RemoveGroupMemberService,
	},
	{
		provide: ChangeMemberRoleUseCaseProvider,
		useClass: ChangeMemberRoleService,
	},
	{
		provide: ListGroupRolesUseCaseProvider,
		useClass: ListGroupRolesService,
	},
	{
		provide: GetGroupRoleUseCaseProvider,
		useClass: GetGroupRoleService,
	},
	{
		provide: CreateGroupRoleUseCaseProvider,
		useClass: CreateGroupRoleService,
	},
	{
		provide: UpdateGroupRoleUseCaseProvider,
		useClass: UpdateGroupRoleService,
	},
	{
		provide: RemoveGroupRoleUseCaseProvider,
		useClass: RemoveGroupRoleService,
	},
	{
		provide: GetGroupPictureUseCaseProvider,
		useClass: GetGroupPictureService,
	},
	{
		provide: GetGroupBannerPictureUseCaseProvider,
		useClass: GetGroupBannerPictureService,
	},
	{
		provide: GroupRepositoryProvider,
		useClass: GroupRepositoryImpl,
	},
	{
		provide: GroupRoleRepositoryProvider,
		useClass: GroupRoleRepositoryImpl,
	},
	{
		provide: GroupMemberRepositoryProvider,
		useClass: GroupMemberRepositoryImpl,
	},
];
