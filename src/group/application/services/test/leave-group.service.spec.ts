import { TestBed } from "@automock/jest";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-access.error";
import { LeaveGroupCommand } from "../../ports/in/commands/leave-group.command";
import { GroupMemberRepository, GroupMemberRepositoryProvider } from "../../ports/out/group-member.repository";
import { GroupRepository, GroupRepositoryProvider } from "../../ports/out/group.repository";
import { UnableToLeaveGroupError } from "../errors/unable-to-leave-group.error";
import { LeaveGroupService } from "../leave-group.service";
import { mockGroup, mockGroupMember, mockUser } from "./group-mock.helper";

describe("LeaveGroupService", () => {
    let service: LeaveGroupService;
    let groupRepository: jest.Mocked<GroupRepository>;
    let groupMemberRepository: jest.Mocked<GroupMemberRepository>;
    let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

    beforeAll(() => {
        const { unit, unitRef } = TestBed.create(LeaveGroupService).compile();

        service = unit;
        groupRepository = unitRef.get(GroupRepositoryProvider);
        groupMemberRepository = unitRef.get(GroupMemberRepositoryProvider);
        getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
    });

    it("should be defined", async () => {
        expect(service).toBeDefined();
    });

    it("should leave group", async () => {
        const group = mockGroup();
        const groupMember = mockGroupMember(false, true, 'member');

        const command = new LeaveGroupCommand(group.id());

        getAuthenticatedUser.execute.mockResolvedValue(groupMember.user());
        groupRepository.findById.mockResolvedValue(group);
        groupMemberRepository.findBy.mockResolvedValue([groupMember]);

        await expect(service.execute(command)).resolves.not.toThrow();
    });

    it("should not leave group if not a member", async () => {
        const group = mockGroup();

        const command = new LeaveGroupCommand(group.id());

        getAuthenticatedUser.execute.mockResolvedValue(mockUser());
        groupRepository.findById.mockResolvedValue(group);
        groupMemberRepository.findBy.mockResolvedValue([]);

        await expect(service.execute(command)).rejects.toThrow(UnauthorizedAccessError);
    });

    it("should not leave group if member is creator", async () => {
        const groupMember = mockGroupMember(true, true, 'administrator');
        const group = groupMember.group();

        const command = new LeaveGroupCommand(group.id());

        getAuthenticatedUser.execute.mockResolvedValue(groupMember.user());
        groupRepository.findById.mockResolvedValue(group);
        groupMemberRepository.findBy.mockResolvedValue([groupMember]);

        await expect(service.execute(command)).rejects.toThrow(UnableToLeaveGroupError);
    });

    it("should not leave group if member is last administrator", async () => {
        const groupMember = mockGroupMember(false, true, 'administrator');
        const group = groupMember.group();

        const command = new LeaveGroupCommand(group.id());

        getAuthenticatedUser.execute.mockResolvedValue(groupMember.user());
        groupRepository.findById.mockResolvedValue(group);
        groupMemberRepository.findBy.mockResolvedValue([groupMember]);

        await expect(service.execute(command)).rejects.toThrow(UnableToLeaveGroupError);
    });
});