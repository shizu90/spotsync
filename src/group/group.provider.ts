import { Provider } from "@nestjs/common";
import { AcceptUserGroupRequestUseCaseProvider } from "./application/ports/in/use-cases/accept-user-group-request.use-case";
import { AcceptUserGroupRequestService } from "./application/services/accept-user-group-request.service";
import { RefuseUserGroupRequestUseCaseProvider } from "./application/ports/in/use-cases/refuse-user-group-request.use-case";
import { RefuseUserGroupRequestService } from "./application/services/refuse-user-group-request.service";
import { CreateUserGroupUseCaseProvider } from "./application/ports/in/use-cases/create-user-group.use-case";
import { CreateUserGroupService } from "./application/services/create-user-group.service";
import { UpdateUserGroupUseCaseProvider } from "./application/ports/in/use-cases/update-user-group.use-case";
import { UpdateUserGroupService } from "./application/services/update-user-group.service";
import { UpdateUserGroupVisibilityUseCaseProvider } from "./application/ports/in/use-cases/update-user-group-visibility.use-case";
import { UpdateUserGroupVisibilityService } from "./application/services/update-user-group-visibility.service";
import { JoinUserGroupUseCaseProvider } from "./application/ports/in/use-cases/join-user-group.use-case";
import { JoinUserGroupService } from "./application/services/join-user-group.service";
import { LeaveUserGroupUseCaseProvider } from "./application/ports/in/use-cases/leave-user-group.use-case";
import { LeaveUserGroupService } from "./application/services/leave-user-group.service";
import { GetUserGroupService } from "./application/services/get-user-group.service";
import { GetUserGroupUseCaseProvider } from "./application/ports/in/use-cases/get-user-group.use-case";
import { DeleteUserGroupUseCaseProvider } from "./application/ports/in/use-cases/delete-user-group.use-case";
import { DeleteUserGroupService } from "./application/services/delete-user-group.service";
import { ListUserGroupsUseCaseProvider } from "./application/ports/in/use-cases/list-user-groups.use-case";
import { ListUserGroupsService } from "./application/services/list-user-groups.service";
import { RemoveUserGroupMemberUseCaseProvider } from "./application/ports/in/use-cases/remove-user-group-member.use-case";
import { RemoveUserGroupMemberService } from "./application/services/remove-user-group-member.service";
import { UserGroupRepositoryProvider } from "./application/ports/out/user-group.repository";
import { UserGroupRepositoryImpl } from "./infrastructure/adapters/out/user-group.db";
import { UserGroupRoleRepositoryImpl } from "./infrastructure/adapters/out/user-group-role.db";
import { UserGroupMemberRepositoryImpl } from "./infrastructure/adapters/out/user-group-member.db";
import { UserGroupRoleRepositoryProvider } from "./application/ports/out/user-group-role.repository";
import { UserGroupMemberRepositoryProvider } from "./application/ports/out/user-group-member.repository";

export const Providers: Provider[] = [
    {
        provide: AcceptUserGroupRequestUseCaseProvider,
        useClass: AcceptUserGroupRequestService
    },
    {
        provide: RefuseUserGroupRequestUseCaseProvider,
        useClass: RefuseUserGroupRequestService
    },
    {
        provide: CreateUserGroupUseCaseProvider,
        useClass: CreateUserGroupService
    },
    {
        provide: UpdateUserGroupUseCaseProvider,
        useClass: UpdateUserGroupService
    },
    {
        provide: UpdateUserGroupVisibilityUseCaseProvider,
        useClass: UpdateUserGroupVisibilityService
    },
    {
        provide: JoinUserGroupUseCaseProvider,
        useClass: JoinUserGroupService
    },
    {
        provide: LeaveUserGroupUseCaseProvider,
        useClass: LeaveUserGroupService
    },
    {
        provide: GetUserGroupUseCaseProvider,
        useClass: GetUserGroupService
    },
    {
        provide: DeleteUserGroupUseCaseProvider,
        useClass: DeleteUserGroupService
    },
    {
        provide: ListUserGroupsUseCaseProvider,
        useClass: ListUserGroupsService
    },
    {
        provide: RemoveUserGroupMemberUseCaseProvider,
        useClass: RemoveUserGroupMemberService
    },
    {
        provide: UserGroupRepositoryProvider,
        useClass: UserGroupRepositoryImpl
    },
    {
        provide: UserGroupRoleRepositoryProvider,
        useClass: UserGroupRoleRepositoryImpl
    },
    {
        provide: UserGroupMemberRepositoryProvider,
        useClass: UserGroupMemberRepositoryImpl
    }
];