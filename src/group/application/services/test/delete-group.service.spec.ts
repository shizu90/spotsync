import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { GroupMemberRepository, GroupMemberRepositoryProvider } from "../../ports/out/group-member.repository";
import { GroupRepository, GroupRepositoryProvider } from "../../ports/out/group.repository";
import { DeleteGroupService } from "../delete-group.service";
import { TestBed } from "@automock/jest";
import { mockGroup, mockGroupMember } from "./group-mock.helper";
import { DeleteGroupCommand } from "../../ports/in/commands/delete-group.command";
import { randomUUID } from "crypto";
import { GroupNotFoundError } from "../errors/group-not-found.error";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-access.error";
import { PermissionName } from "src/group/domain/permission-name.enum";

describe("DeleteGroupService", () => {
    let service: DeleteGroupService;
    let groupRepository: jest.Mocked<GroupRepository>;
    let groupMemberRepository: jest.Mocked<GroupMemberRepository>;
    let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

    beforeAll(() => {
        const { unit, unitRef } = TestBed.create(DeleteGroupService).compile();

        service = unit;
        groupRepository = unitRef.get(GroupRepositoryProvider);
        groupMemberRepository = unitRef.get(GroupMemberRepositoryProvider);
        getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should delete group', async () => {
        const authenticatedGroupMember = mockGroupMember(true);

        const command = new DeleteGroupCommand(
            authenticatedGroupMember.group().id(),
        );

        getAuthenticatedUser.execute.mockReturnValue(authenticatedGroupMember.user().id());
        groupRepository.findById.mockResolvedValue(authenticatedGroupMember.group());
        groupMemberRepository.findBy.mockResolvedValue([authenticatedGroupMember]);

        await service.execute(command);

        expect(authenticatedGroupMember.group().isDeleted()).toBe(true);
    });

    it('should not delete group if group does not exist', async () => {
        const command = new DeleteGroupCommand(
            randomUUID()
        );

        getAuthenticatedUser.execute.mockReturnValue(randomUUID());
        groupRepository.findById.mockResolvedValue(null);

        await expect(service.execute(command)).rejects.toThrow(GroupNotFoundError);
    });

    it('should not delete group if user is not a member of the group', async () => {
        const command = new DeleteGroupCommand(
            randomUUID()
        );

        getAuthenticatedUser.execute.mockReturnValue(randomUUID());
        groupRepository.findById.mockResolvedValue(mockGroup());
        groupMemberRepository.findBy.mockResolvedValue([]);

        await expect(service.execute(command)).rejects.toThrow(UnauthorizedAccessError);
    });

    it('should not delete group if user is does not have permission', async () => {
        const authenticatedGroupMember = mockGroupMember(false);

        authenticatedGroupMember.role().removePermission(authenticatedGroupMember.role().findPermission(PermissionName.DELETE_GROUP));
        
        const command = new DeleteGroupCommand(
            authenticatedGroupMember.group().id()
        );

        getAuthenticatedUser.execute.mockReturnValue(authenticatedGroupMember.user().id());
        groupRepository.findById.mockResolvedValue(authenticatedGroupMember.group());
        groupMemberRepository.findBy.mockResolvedValue([authenticatedGroupMember]);

        await expect(service.execute(command)).rejects.toThrow(UnauthorizedAccessError);
    });
});