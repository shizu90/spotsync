import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { GroupMemberRepository, GroupMemberRepositoryProvider } from "../../ports/out/group-member.repository";
import { GroupRepository, GroupRepositoryProvider } from "../../ports/out/group.repository";
import { CreateGroupRoleService } from "../create-group-role.service";
import { GroupRoleRepository, GroupRoleRepositoryProvider } from "../../ports/out/group-role.repository";
import { TestBed } from "@automock/jest";
import { mockGroupMember } from "./group-mock.helper";
import { CreateGroupRoleCommand } from "../../ports/in/commands/create-group-role.command";
import { randomUUID } from "crypto";
import { GroupPermission } from "src/group/domain/group-permission.model";
import { PermissionName } from "src/group/domain/permission-name.enum";
import { GroupNotFoundError } from "../errors/group-not-found.error";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-access.error";

describe("CreateGroupRoleService", () => {
    let service: CreateGroupRoleService;
    let groupRepository: jest.Mocked<GroupRepository>;
    let groupMemberRepository: jest.Mocked<GroupMemberRepository>;
    let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;
    let groupRoleRepository: jest.Mocked<GroupRoleRepository>;

    beforeAll(() => {
        const { unit, unitRef } = TestBed.create(CreateGroupRoleService).compile();

        service = unit;
        groupRepository = unitRef.get(GroupRepositoryProvider);
        groupMemberRepository = unitRef.get(GroupMemberRepositoryProvider);
        getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
        groupRoleRepository = unitRef.get(GroupRoleRepositoryProvider);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create a group role', async () => {
        const authenticatedGroupMember = mockGroupMember(true);

        const command = new CreateGroupRoleCommand(
            authenticatedGroupMember.group().id(),
            'Test Role',
            '#000000',
            [randomUUID(), randomUUID()]
        );

        getAuthenticatedUser.execute.mockReturnValue(authenticatedGroupMember.user().id());
        groupRepository.findById.mockResolvedValue(authenticatedGroupMember.group());
        groupMemberRepository.findBy.mockResolvedValue([authenticatedGroupMember]);
        groupRoleRepository.findPermissionById.mockResolvedValue(
            GroupPermission.create(randomUUID(), PermissionName.UPDATE_SETTINGS)
        );

        const response = await service.execute(command);

        expect(response.name).toBe(command.name);
        expect(response.hex_color).toBe(command.hexColor);
        expect(response.permissions.length).toBe(command.permissionIds.length);
        expect(response.is_immutable).toBe(false);
    });

    it('should not create a group role if group does not exist', async () => {
        const authenticatedGroupMember = mockGroupMember(true);

        const command = new CreateGroupRoleCommand(
            randomUUID(),
            'Test Role',
            '#000000',
            [randomUUID(), randomUUID()]
        );

        getAuthenticatedUser.execute.mockReturnValue(authenticatedGroupMember.user().id());
        groupRepository.findById.mockResolvedValue(null);

        await expect(service.execute(command)).rejects.toThrow(GroupNotFoundError);
    });

    it('should not create a group role if user is not a member of the group', async () => {
        const authenticatedGroupMember = mockGroupMember(true);

        const command = new CreateGroupRoleCommand(
            authenticatedGroupMember.group().id(),
            'Test Role',
            '#000000',
            [randomUUID(), randomUUID()]
        );

        getAuthenticatedUser.execute.mockReturnValue(authenticatedGroupMember.user().id());
        groupRepository.findById.mockResolvedValue(authenticatedGroupMember.group());
        groupMemberRepository.findBy.mockResolvedValue([]);

        await expect(service.execute(command)).rejects.toThrow(UnauthorizedAccessError);
    });

    it('should not create a group role if user does not have permission', async () => {
        const authenticatedGroupMember = mockGroupMember(false);

        authenticatedGroupMember.role().removePermission(authenticatedGroupMember.role().findPermission(PermissionName.UPDATE_SETTINGS));

        const command = new CreateGroupRoleCommand(
            authenticatedGroupMember.group().id(),
            'Test Role',
            '#000000',
            [randomUUID(), randomUUID()]
        );

        getAuthenticatedUser.execute.mockReturnValue(authenticatedGroupMember.user().id());
        groupRepository.findById.mockResolvedValue(authenticatedGroupMember.group());
        groupMemberRepository.findBy.mockResolvedValue([authenticatedGroupMember]);

        await expect(service.execute(command)).rejects.toThrow(UnauthorizedAccessError);
    });
});