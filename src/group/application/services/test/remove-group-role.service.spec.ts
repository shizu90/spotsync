import { TestBed } from "@automock/jest";
import { randomUUID } from "crypto";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-access.error";
import { GroupPermissionName } from "src/group/domain/group-permission-name.enum";
import { RemoveGroupRoleCommand } from "../../ports/in/commands/remove-group-role.command";
import { GroupMemberRepository, GroupMemberRepositoryProvider } from "../../ports/out/group-member.repository";
import { GroupRoleRepository, GroupRoleRepositoryProvider } from "../../ports/out/group-role.repository";
import { GroupRepository, GroupRepositoryProvider } from "../../ports/out/group.repository";
import { GroupRoleNotFoundError } from "../errors/group-role-not-found.error";
import { RemoveGroupRoleService } from "../remove-group-role.service";
import { mockGroupMember, mockGroupRole } from "./group-mock.helper";

describe("RemoveGroupRoleService", () => {
    let service: RemoveGroupRoleService;
    let groupRepository: jest.Mocked<GroupRepository>;
    let groupMemberRepository: jest.Mocked<GroupMemberRepository>;
    let groupRoleRepository: jest.Mocked<GroupRoleRepository>;
    let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

    beforeAll(() => {
        const { unit, unitRef } = TestBed.create(RemoveGroupRoleService).compile();

        service = unit;
        groupRepository = unitRef.get(GroupRepositoryProvider);
        groupMemberRepository = unitRef.get(GroupMemberRepositoryProvider);
        getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
        groupRoleRepository = unitRef.get(GroupRoleRepositoryProvider);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    it('should remove group role', async () => {
        const groupMember = mockGroupMember(true, true, 'administrator');
        const groupRole = mockGroupRole();

        const command = new RemoveGroupRoleCommand(
            groupRole.id(),
            groupMember.group().id()
        );

        getAuthenticatedUser.execute.mockResolvedValue(groupMember.user());
        groupRepository.findById.mockResolvedValue(groupMember.group());
        groupMemberRepository.findBy.mockResolvedValue([groupMember]);
        groupRoleRepository.findById.mockResolvedValue(groupRole);

        await expect(service.execute(command)).resolves.not.toThrow();
    });

    it('should not remove group role if it does not exist', async() => {
        const groupMember = mockGroupMember(true, true, 'administrator');
        
        const command = new RemoveGroupRoleCommand(
            randomUUID(),
            groupMember.group().id()
        );

        getAuthenticatedUser.execute.mockResolvedValue(groupMember.user());
        groupRepository.findById.mockResolvedValue(groupMember.group());
        groupMemberRepository.findBy.mockResolvedValue([groupMember]);
        groupRoleRepository.findById.mockResolvedValue(null);

        await expect(service.execute(command)).rejects.toThrow(GroupRoleNotFoundError);
    });

    it('should not remove group role if user is not authorized', async () => {
        const groupMember = mockGroupMember(false, false, 'administrator');
        groupMember.role().removePermission(groupMember.role().findPermission(GroupPermissionName.REMOVE_ROLE));
        const groupRole = mockGroupRole();

        const command = new RemoveGroupRoleCommand(
            groupRole.id(),
            groupMember.group().id()
        );

        getAuthenticatedUser.execute.mockResolvedValue(groupMember.user());
        groupRepository.findById.mockResolvedValue(groupMember.group());
        groupMemberRepository.findBy.mockResolvedValue([groupMember]);
        groupRoleRepository.findById.mockResolvedValue(groupRole);

        await expect(service.execute(command)).rejects.toThrow(UnauthorizedAccessError);
    });
});