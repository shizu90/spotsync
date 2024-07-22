import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { GroupMemberRepository, GroupMemberRepositoryProvider } from "../../ports/out/group-member.repository";
import { GroupRepository, GroupRepositoryProvider } from "../../ports/out/group.repository";
import { RefuseGroupRequestService } from "../refuse-group-request.service";
import { TestBed } from "@automock/jest";
import { mockGroupMember, mockGroupMemberRequest } from "./group-mock.helper";
import { RefuseGroupRequestCommand } from "../../ports/in/commands/refuse-group-request.command";
import { randomUUID } from "crypto";
import { GroupNotFoundError } from "../errors/group-not-found.error";
import { GroupRequestNotFoundError } from "../errors/group-request-not-found.error";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-access.error";
import { PermissionName } from "src/group/domain/permission-name.enum";

describe("RefuseGroupRequestService", () => {
    let service: RefuseGroupRequestService;
    let groupRepository: jest.Mocked<GroupRepository>;
    let groupMemberRepository: jest.Mocked<GroupMemberRepository>;
    let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

    beforeAll(() => {
        const { unit, unitRef } = TestBed.create(RefuseGroupRequestService).compile();

        service = unit;
        groupRepository = unitRef.get(GroupRepositoryProvider);
        groupMemberRepository = unitRef.get(GroupMemberRepositoryProvider);
        getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should refuse group request', async () => {
        const authenticatedGroupMember = mockGroupMember(true);
        const groupRequest = mockGroupMemberRequest();

        const command = new RefuseGroupRequestCommand(
            groupRequest.id(),
            authenticatedGroupMember.group().id()
        );

        getAuthenticatedUser.execute.mockReturnValue(authenticatedGroupMember.user().id());
        groupRepository.findById.mockResolvedValue(authenticatedGroupMember.group());
        groupMemberRepository.findBy.mockResolvedValue([authenticatedGroupMember]);
        groupMemberRepository.findRequestById.mockResolvedValue(groupRequest);

        await expect(service.execute(command)).resolves.not.toThrow();
    });

    it('should not refuse group request if group does not exist', async () => {
        const authenticatedGroupMember = mockGroupMember(true);
        const groupRequest = mockGroupMemberRequest();

        const command = new RefuseGroupRequestCommand(
            groupRequest.id(),
            randomUUID()
        );

        getAuthenticatedUser.execute.mockReturnValue(authenticatedGroupMember.user().id());
        groupRepository.findById.mockResolvedValue(null);
        groupMemberRepository.findBy.mockResolvedValue([authenticatedGroupMember]);
        groupMemberRepository.findRequestById.mockResolvedValue(groupRequest);

        await expect(service.execute(command)).rejects.toThrow(GroupNotFoundError);
    });

    it('should not refuse group request if group request does not exist', async () => {
        const authenticatedGroupMember = mockGroupMember(true);

        const command = new RefuseGroupRequestCommand(
            randomUUID(),
            authenticatedGroupMember.group().id()
        );

        getAuthenticatedUser.execute.mockReturnValueOnce(authenticatedGroupMember.user().id());
        groupRepository.findById.mockResolvedValueOnce(authenticatedGroupMember.group());
        groupMemberRepository.findBy.mockResolvedValueOnce([authenticatedGroupMember]);
        groupMemberRepository.findRequestById.mockResolvedValueOnce(null);

        await expect(service.execute(command)).rejects.toThrow(GroupRequestNotFoundError);
    });

    it('should not refuse group request if user is not a member of the group', async () => {
        const authenticatedGroupMember = mockGroupMember(true);
        const groupRequest = mockGroupMemberRequest();

        const command = new RefuseGroupRequestCommand(
            groupRequest.id(),
            authenticatedGroupMember.group().id()
        );

        getAuthenticatedUser.execute.mockReturnValueOnce(randomUUID());
        groupRepository.findById.mockResolvedValueOnce(authenticatedGroupMember.group());
        groupMemberRepository.findBy.mockResolvedValueOnce([]);
        groupMemberRepository.findRequestById.mockResolvedValueOnce(groupRequest);

        await expect(service.execute(command)).rejects.toThrow(UnauthorizedAccessError);
    });

    it('should not refuse group request if user does not have permission', async () => {
        const authenticatedGroupMember = mockGroupMember(false);

        authenticatedGroupMember.role().removePermission(authenticatedGroupMember.role().findPermission(PermissionName.ACCEPT_REQUESTS));

        const groupRequest = mockGroupMemberRequest();

        const command = new RefuseGroupRequestCommand(
            groupRequest.id(),
            authenticatedGroupMember.group().id()
        );

        getAuthenticatedUser.execute.mockReturnValueOnce(authenticatedGroupMember.user().id());
        groupRepository.findById.mockResolvedValueOnce(authenticatedGroupMember.group());
        groupMemberRepository.findBy.mockResolvedValueOnce([authenticatedGroupMember]);
        groupMemberRepository.findRequestById.mockResolvedValueOnce(groupRequest);

        await expect(service.execute(command)).rejects.toThrow(UnauthorizedAccessError);
    });
});