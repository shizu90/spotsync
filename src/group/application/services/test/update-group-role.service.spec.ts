import { TestBed } from "@automock/jest";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { UpdateGroupRoleCommand } from "../../ports/in/commands/update-group-role.command";
import { GroupMemberRepository, GroupMemberRepositoryProvider } from "../../ports/out/group-member.repository";
import { GroupRoleRepository, GroupRoleRepositoryProvider } from "../../ports/out/group-role.repository";
import { GroupRepository, GroupRepositoryProvider } from "../../ports/out/group.repository";
import { UpdateGroupRoleService } from "../update-group-role.service";
import { mockGroupMember, mockGroupRole } from "./group-mock.helper";

describe("UpdateGroupRoleService", () => {
    let service: UpdateGroupRoleService;
    let groupRepository: jest.Mocked<GroupRepository>;
    let groupMemberRepository: jest.Mocked<GroupMemberRepository>;
    let groupRoleRepository: jest.Mocked<GroupRoleRepository>;
    let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

    beforeAll(() => {
        const { unit, unitRef } = TestBed.create(UpdateGroupRoleService).compile();

        service = unit;
        groupRepository = unitRef.get(GroupRepositoryProvider);
        groupMemberRepository = unitRef.get(GroupMemberRepositoryProvider);
        groupRoleRepository = unitRef.get(GroupRoleRepositoryProvider);
        getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should update group role', async () => {
        const groupMember = mockGroupMember(true, true, 'administrator');
        const groupRole = mockGroupRole();

        const command = new UpdateGroupRoleCommand(
            groupRole.id(),
            groupMember.group().id(),
            'New Role Name'
        );

        getAuthenticatedUser.execute.mockResolvedValue(groupMember.user());
        groupRepository.findById.mockResolvedValue(groupMember.group());
        groupMemberRepository.findBy.mockResolvedValue([groupMember]);
        groupRoleRepository.findById.mockResolvedValue(groupRole);
        groupRoleRepository.findByName.mockResolvedValue(null);

        await expect(service.execute(command)).resolves.not.toThrow();
        expect(groupRole.name()).toBe(command.name);
    });
});