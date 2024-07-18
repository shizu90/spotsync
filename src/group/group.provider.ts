import { Provider } from '@nestjs/common';
import { AcceptGroupRequestUseCaseProvider } from './application/ports/in/use-cases/accept-group-request.use-case';
import { RefuseGroupRequestUseCaseProvider } from './application/ports/in/use-cases/refuse-group-request.use-case';
import { RefuseGroupRequestService } from './application/services/refuse-group-request.service';
import { CreateGroupUseCaseProvider } from './application/ports/in/use-cases/create-group.use-case';
import { UpdateGroupUseCaseProvider } from './application/ports/in/use-cases/update-group.use-case';
import { UpdateGroupService } from './application/services/update-group.service';
import { UpdateGroupVisibilityUseCaseProvider } from './application/ports/in/use-cases/update-group-visibility.use-case';
import { UpdateGroupVisibilityService } from './application/services/update-group-visibility.service';
import { JoinGroupUseCaseProvider } from './application/ports/in/use-cases/join-group.use-case';
import { JoinGroupService } from './application/services/join-group.service';
import { LeaveGroupUseCaseProvider } from './application/ports/in/use-cases/leave-group.use-case';
import { LeaveGroupService } from './application/services/leave-group.service';
import { GetGroupService } from './application/services/get-group.service';
import { GetGroupUseCaseProvider } from './application/ports/in/use-cases/get-group.use-case';
import { DeleteGroupUseCaseProvider } from './application/ports/in/use-cases/delete-group.use-case';
import { DeleteGroupService } from './application/services/delete-group.service';
import { ListGroupsUseCaseProvider } from './application/ports/in/use-cases/list-groups.use-case';
import { ListGroupsService } from './application/services/list-groups.service';
import { RemoveGroupMemberUseCaseProvider } from './application/ports/in/use-cases/remove-group-member.use-case';
import { RemoveGroupMemberService } from './application/services/remove-group-member.service';
import { GroupRepositoryProvider } from './application/ports/out/group.repository';
import { GroupRepositoryImpl } from './infrastructure/adapters/out/group.db';
import { GroupRoleRepositoryImpl } from './infrastructure/adapters/out/group-role.db';
import { GroupMemberRepositoryImpl } from './infrastructure/adapters/out/group-member.db';
import { GroupRoleRepositoryProvider } from './application/ports/out/group-role.repository';
import { GroupMemberRepositoryProvider } from './application/ports/out/group-member.repository';
import { AcceptGroupRequestService } from './application/services/accept-group-request.service';
import { CreateGroupService } from './application/services/create-group.service';
import { CreateGroupRoleUseCaseProvider } from './application/ports/in/use-cases/create-group-role.use-case';
import { CreateGroupRoleService } from './application/services/create-group-role.service';
import { UpdateGroupRoleUseCaseProvider } from './application/ports/in/use-cases/update-group-role.use-case';
import { UpdateGroupRoleService } from './application/services/update-group-role.service';
import { RemoveGroupRoleUseCaseProvider } from './application/ports/in/use-cases/remove-group-role.use-case';
import { RemoveGroupRoleService } from './application/services/remove-group-role.service';
import { ChangeMemberRoleUseCaseProvider } from './application/ports/in/use-cases/change-member-role.use-case';
import { ChangeMemberRoleService } from './application/services/change-member-role.service';
import { ListGroupMembersUseCaseProvider } from './application/ports/in/use-cases/list-group-members.use-case';
import { ListGroupMembersService } from './application/services/list-group-members.service';
import { ListGroupRolesUseCaseProvider } from './application/ports/in/use-cases/list-group-roles.use-case';
import { ListGroupRolesService } from './application/services/list-group-roles.service';
import { GetGroupRoleUseCaseProvider } from './application/ports/in/use-cases/get-group-role.use-case';
import { GetGroupRoleService } from './application/services/get-group-role.service';
import { ListGroupRequestsUseCaseProvider } from './application/ports/in/use-cases/list-group-requests.use-case';
import { ListGroupRequestsService } from './application/services/list-group-requests.service';
import { GetGroupHistoryUseCaseProvider } from './application/ports/in/use-cases/get-group-history.use-case';
import { GetGroupHistoryService } from './application/services/get-group-history.service';

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
		provide: ListGroupRequestsUseCaseProvider,
		useClass: ListGroupRequestsService,
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
