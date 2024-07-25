import { TestBed } from "@automock/jest";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { AcceptGroupRequestCommand } from "../../ports/in/commands/accept-group-request.command";
import { AcceptGroupRequestDto } from "../../ports/out/dto/accept-group-request.dto";
import { GroupMemberRepository, GroupMemberRepositoryProvider } from "../../ports/out/group-member.repository";
import { GroupRoleRepository, GroupRoleRepositoryProvider } from "../../ports/out/group-role.repository";
import { GroupRepository, GroupRepositoryProvider } from "../../ports/out/group.repository";
import { AcceptGroupRequestService } from "../accept-group-request.service";
import { mockGroupMember, mockGroupMemberRequest, mockGroupRole } from "./group-mock.helper";

describe("AcceptGroupRequestService", () => {
    let service: AcceptGroupRequestService;
    let groupMemberRepository: jest.Mocked<GroupMemberRepository>;
    let groupRepository: jest.Mocked<GroupRepository>;
    let groupRoleRepository: jest.Mocked<GroupRoleRepository>;
    let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

    beforeAll(() => {
        const { unit, unitRef } = TestBed.create(AcceptGroupRequestService).compile();

        service = unit;
        groupMemberRepository = unitRef.get(GroupMemberRepositoryProvider);
        groupRepository = unitRef.get(GroupRepositoryProvider);
        groupRoleRepository = unitRef.get(GroupRoleRepositoryProvider);
        getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
    });

    it('should be defined', async () => {
        expect(service).toBeDefined();
    });

    it('should accept group request', async () => {
        const request = mockGroupMemberRequest();   
        const groupMember = mockGroupMember(true, true, 'administrator');
        const memberRole = mockGroupRole();

        const command = new AcceptGroupRequestCommand(
            request.id(),
            groupMember.group().id()
        );

        getAuthenticatedUser.execute.mockResolvedValue(groupMember.user());
        groupRepository.findById.mockResolvedValue(groupMember.group());
        groupMemberRepository.findBy.mockResolvedValue([groupMember]);
        groupMemberRepository.findRequestById.mockResolvedValue(request);
        groupRoleRepository.findByName.mockResolvedValue(memberRole)

        const member = await service.execute(command);

        expect(member).toBeInstanceOf(AcceptGroupRequestDto);
        expect(member.group_id).toBe(groupMember.group().id());
    });
});