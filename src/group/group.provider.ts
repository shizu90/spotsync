import { Provider } from "@nestjs/common";
import { AcceptGroupRequestUseCaseProvider } from "./application/ports/in/use-cases/accept-group-request.use-case";
import { RefuseGroupRequestUseCaseProvider } from "./application/ports/in/use-cases/refuse-group-request.use-case";
import { RefuseGroupRequestService } from "./application/services/refuse-group-request.service";
import { CreateGroupUseCaseProvider } from "./application/ports/in/use-cases/create-group.use-case";
import { UpdateGroupUseCaseProvider } from "./application/ports/in/use-cases/update-group.use-case";
import { UpdateGroupService } from "./application/services/update-group.service";
import { UpdateGroupVisibilityUseCaseProvider } from "./application/ports/in/use-cases/update-group-visibility.use-case";
import { UpdateGroupVisibilityService } from "./application/services/update-group-visibility.service";
import { JoinGroupUseCaseProvider } from "./application/ports/in/use-cases/join-group.use-case";
import { JoinGroupService } from "./application/services/join-group.service";
import { LeaveGroupUseCaseProvider } from "./application/ports/in/use-cases/leave-group.use-case";
import { LeaveGroupService } from "./application/services/leave-group.service";
import { GetGroupService } from "./application/services/get-group.service";
import { GetGroupUseCaseProvider } from "./application/ports/in/use-cases/get-group.use-case";
import { DeleteGroupUseCaseProvider } from "./application/ports/in/use-cases/delete-group.use-case";
import { DeleteGroupService } from "./application/services/delete-group.service";
import { ListGroupsUseCaseProvider } from "./application/ports/in/use-cases/list-groups.use-case";
import { ListGroupsService } from "./application/services/list-groups.service";
import { RemoveGroupMemberUseCaseProvider } from "./application/ports/in/use-cases/remove-group-member.use-case";
import { RemoveGroupMemberService } from "./application/services/remove-group-member.service";
import { GroupRepositoryProvider } from "./application/ports/out/group.repository";
import { GroupRepositoryImpl } from "./infrastructure/adapters/out/group.db";
import { GroupRoleRepositoryImpl } from "./infrastructure/adapters/out/group-role.db";
import { GroupMemberRepositoryImpl } from "./infrastructure/adapters/out/group-member.db";
import { GroupRoleRepositoryProvider } from "./application/ports/out/group-role.repository";
import { GroupMemberRepositoryProvider } from "./application/ports/out/group-member.repository";
import { AcceptGroupRequestService } from "./application/services/accept-group-request.service";
import { CreateGroupService } from "./application/services/create-group.service";

export const Providers: Provider[] = [
    {
        provide: AcceptGroupRequestUseCaseProvider,
        useClass: AcceptGroupRequestService
    },
    {
        provide: RefuseGroupRequestUseCaseProvider,
        useClass: RefuseGroupRequestService
    },
    {
        provide: CreateGroupUseCaseProvider,
        useClass: CreateGroupService
    },
    {
        provide: UpdateGroupUseCaseProvider,
        useClass: UpdateGroupService
    },
    {
        provide: UpdateGroupVisibilityUseCaseProvider,
        useClass: UpdateGroupVisibilityService
    },
    {
        provide: JoinGroupUseCaseProvider,
        useClass: JoinGroupService
    },
    {
        provide: LeaveGroupUseCaseProvider,
        useClass: LeaveGroupService
    },
    {
        provide: GetGroupUseCaseProvider,
        useClass: GetGroupService
    },
    {
        provide: DeleteGroupUseCaseProvider,
        useClass: DeleteGroupService
    },
    {
        provide: ListGroupsUseCaseProvider,
        useClass: ListGroupsService
    },
    {
        provide: RemoveGroupMemberUseCaseProvider,
        useClass: RemoveGroupMemberService
    },
    {
        provide: GroupRepositoryProvider,
        useClass: GroupRepositoryImpl
    },
    {
        provide: GroupRoleRepositoryProvider,
        useClass: GroupRoleRepositoryImpl
    },
    {
        provide: GroupMemberRepositoryProvider,
        useClass: GroupMemberRepositoryImpl
    }
];