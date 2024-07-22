import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { GroupMemberRepository, GroupMemberRepositoryProvider } from "../../ports/out/group-member.repository";
import { GroupRoleRepository, GroupRoleRepositoryProvider } from "../../ports/out/group-role.repository";
import { GroupRepository, GroupRepositoryProvider } from "../../ports/out/group.repository";
import { AcceptGroupRequestService } from "../accept-group-request.service";
import { TestBed } from "@automock/jest";
import { UserRepository, UserRepositoryProvider } from "src/user/application/ports/out/user.repository";
import { mockGroupMember, mockGroupMemberRequest, mockGroupRole } from "./group-mock.helper";
import { AcceptGroupRequestCommand } from "../../ports/in/commands/accept-group-request.command";
import { randomUUID } from "crypto";
import { GroupRequestNotFoundError } from "../errors/group-request-not-found.error";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-access.error";
import { PermissionName } from "src/group/domain/permission-name.enum";

describe("AcceptGroupRequestService", () => {
    let service: AcceptGroupRequestService;
    let groupRepository: jest.Mocked<GroupRepository>;
    let groupMemberRepository: jest.Mocked<GroupMemberRepository>;
    let groupRoleRepository: jest.Mocked<GroupRoleRepository>;
    let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;
    let userRepository: jest.Mocked<UserRepository>;

    beforeAll(() => {
        const { unit, unitRef } = TestBed.create(AcceptGroupRequestService).compile();

        service = unit;
        groupRepository = unitRef.get(GroupRepositoryProvider);
        groupMemberRepository = unitRef.get(GroupMemberRepositoryProvider);
        groupRoleRepository = unitRef.get(GroupRoleRepositoryProvider);
        getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
        userRepository = unitRef.get(UserRepositoryProvider);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should accept group request', async () => {
        const groupMember = mockGroupMember();
        const groupMemberRequest = mockGroupMemberRequest();
        
        const command = new AcceptGroupRequestCommand(
            groupMemberRequest.id(),
            groupMember.group().id()
        );

        const role = mockGroupRole();

        getAuthenticatedUser.execute.mockReturnValue(groupMember.user().id());
        groupRepository.findById.mockResolvedValue(groupMember.group());
        groupMemberRepository.findBy.mockResolvedValue([groupMember]);
        groupMemberRepository.findRequestById.mockResolvedValue(groupMemberRequest);
        groupRoleRepository.findByName.mockResolvedValue(role);

        const response = await service.execute(command);

        expect(response.user.first_name).toBe(groupMemberRequest.user().firstName());
        expect(response.group_role.name).toBe(role.name());
    });

    it('should not accept group request if group request does not exist', async () => {
        const groupMember = mockGroupMember();

        const command = new AcceptGroupRequestCommand(
            randomUUID(),
            groupMember.group().id()
        );

        getAuthenticatedUser.execute.mockReturnValue(groupMember.user().id());
        groupRepository.findById.mockResolvedValue(groupMember.group());
        groupMemberRepository.findBy.mockResolvedValue([groupMember]);
        groupMemberRepository.findRequestById.mockResolvedValue(null);

        await expect(service.execute(command)).rejects.toThrow(GroupRequestNotFoundError);
    });

    it('should not accept group request if user is not a member of the group', async () => {
        const groupMember = mockGroupMember();
        const groupMemberRequest = mockGroupMemberRequest();
        
        const command = new AcceptGroupRequestCommand(
            groupMemberRequest.id(),
            groupMember.group().id()
        );

        getAuthenticatedUser.execute.mockReturnValue(groupMember.user().id());
        groupRepository.findById.mockResolvedValue(groupMember.group());
        groupMemberRepository.findBy.mockResolvedValue([]);

        await expect(service.execute(command)).rejects.toThrow(UnauthorizedAccessError);
    });

    it('should not accept group request if user does not have permission to accept requests', async () => {
        const groupMember = mockGroupMember();
        const groupMemberRequest = mockGroupMemberRequest();
        
        groupMember.role().removePermission(groupMember.role().findPermission(PermissionName.ACCEPT_REQUESTS));

        const command = new AcceptGroupRequestCommand(
            groupMemberRequest.id(),
            groupMember.group().id()
        );

        getAuthenticatedUser.execute.mockReturnValue(groupMember.user().id());
        groupRepository.findById.mockResolvedValue(groupMember.group());
        groupMemberRepository.findBy.mockResolvedValue([groupMember]);
        groupMemberRepository.findRequestById.mockResolvedValue(groupMemberRequest);
        

        await expect(service.execute(command)).rejects.toThrow(UnauthorizedAccessError);
    });
});