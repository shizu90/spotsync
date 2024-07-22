import { TestBed } from "@automock/jest";
import { GroupMemberRepository, GroupMemberRepositoryProvider } from "../../ports/out/group-member.repository";
import { GroupRoleRepository, GroupRoleRepositoryProvider } from "../../ports/out/group-role.repository";
import { GroupRepository, GroupRepositoryProvider } from "../../ports/out/group.repository";
import { GetGroupRoleService } from "../get-group-role.service";
import { GetGroupRoleCommand } from "../../ports/in/commands/get-group-role.command";
import { mockGroupMember } from "./group-mock.helper";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";

describe("GetGroupRoleService", () => {
    let service: GetGroupRoleService;
    let groupRepository: jest.Mocked<GroupRepository>;
    let groupMemberRepository: jest.Mocked<GroupMemberRepository>;
    let groupRoleRepository: jest.Mocked<GroupRoleRepository>;
    let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;
    
    beforeAll(() => {
        const { unit, unitRef } = TestBed.create(GetGroupRoleService).compile();

        service = unit;
        groupRepository = unitRef.get(GroupRepositoryProvider);
        groupMemberRepository = unitRef.get(GroupMemberRepositoryProvider);
        groupRoleRepository = unitRef.get(GroupRoleRepositoryProvider);
        getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should get group role', async () => {
        const authenticatedGroupMember = mockGroupMember(true);
        const role = authenticatedGroupMember.role();

        const command = new GetGroupRoleCommand(
            role.id(),
            authenticatedGroupMember.group().id(),
        );

        getAuthenticatedUser.execute.mockReturnValue(authenticatedGroupMember.user().id());
        groupRepository.findById.mockResolvedValue(authenticatedGroupMember.group());
        groupMemberRepository.findBy.mockResolvedValue([authenticatedGroupMember]);
        groupRoleRepository.findById.mockResolvedValue(role);

        const response = await service.execute(command);

        expect(response.id).toBe(role.id());
    });
});