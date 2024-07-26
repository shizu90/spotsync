import { TestBed } from "@automock/jest";
import { randomUUID } from "crypto";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-access.error";
import { GroupPermissionName } from "src/group/domain/group-permission-name.enum";
import { RefuseGroupRequestCommand } from "../../ports/in/commands/refuse-group-request.command";
import { GroupMemberRepository, GroupMemberRepositoryProvider } from "../../ports/out/group-member.repository";
import { GroupRepository, GroupRepositoryProvider } from "../../ports/out/group.repository";
import { GroupRequestNotFoundError } from "../errors/group-request-not-found.error";
import { RefuseGroupRequestService } from "../refuse-group-request.service";
import { mockGroupMember, mockGroupMemberRequest } from "./group-mock.helper";

describe('RefuseGroupRequestService', () => {
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
        const groupMember = mockGroupMember(true, true, 'administrator');
        const groupRequest = mockGroupMemberRequest();

        const command = new RefuseGroupRequestCommand(
            groupRequest.id(), 
            groupRequest.group().id()
        );

        getAuthenticatedUser.execute.mockResolvedValue(groupMember.user());
        groupRepository.findById.mockResolvedValue(groupRequest.group());
        groupMemberRepository.findBy.mockResolvedValue([groupMember]);
        groupMemberRepository.findRequestById.mockResolvedValue(groupRequest);

        await expect(service.execute(command)).resolves.not.toThrow();
    });

    it('should not refuse group request if it does not exist', async () => {
        const groupMember = mockGroupMember(true, true, 'administrator');

        const command = new RefuseGroupRequestCommand(
            randomUUID(),
            groupMember.group().id()
        );

        getAuthenticatedUser.execute.mockResolvedValue(groupMember.user());
        groupRepository.findById.mockResolvedValue(groupMember.group());
        groupMemberRepository.findBy.mockResolvedValue([groupMember]);
        groupMemberRepository.findRequestById.mockResolvedValue(null);

        await expect(service.execute(command)).rejects.toThrow(GroupRequestNotFoundError);
    });

    it('should not refuse group request if user is not authorized', async () => {
        const groupMember = mockGroupMember(false, false, 'administrator');
        groupMember.role().removePermission(groupMember.role().findPermission(GroupPermissionName.ACCEPT_REQUESTS));
        const groupRequest = mockGroupMemberRequest();

        const command = new RefuseGroupRequestCommand(
            groupRequest.id(), 
            groupRequest.group().id()
        );

        getAuthenticatedUser.execute.mockResolvedValue(groupMember.user());
        groupRepository.findById.mockResolvedValue(groupRequest.group());
        groupMemberRepository.findBy.mockResolvedValue([groupMember]);
        groupMemberRepository.findRequestById.mockResolvedValue(groupRequest);

        await expect(service.execute(command)).rejects.toThrow(UnauthorizedAccessError);
    });
});