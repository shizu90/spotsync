import { TestBed } from "@automock/jest";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { JoinGroupCommand } from "../../ports/in/commands/join-group.command";
import { AcceptGroupRequestDto } from "../../ports/out/dto/accept-group-request.dto";
import { GroupMemberRepository, GroupMemberRepositoryProvider } from "../../ports/out/group-member.repository";
import { GroupRoleRepository, GroupRoleRepositoryProvider } from "../../ports/out/group-role.repository";
import { GroupRepository, GroupRepositoryProvider } from "../../ports/out/group.repository";
import { JoinGroupService } from "../join-group.service";
import { mockGroup, mockGroupRole, mockUser } from "./group-mock.helper";

describe('JoinGroupService', () => {
    let service: JoinGroupService;
    let groupRepository: jest.Mocked<GroupRepository>;
    let groupMemberRepository: jest.Mocked<GroupMemberRepository>;
    let groupRoleRepository: jest.Mocked<GroupRoleRepository>;
    let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

    beforeAll(() => {
        const { unit, unitRef } = TestBed.create(JoinGroupService).compile();

        service = unit;
        groupRepository = unitRef.get(GroupRepositoryProvider);
        groupMemberRepository = unitRef.get(GroupMemberRepositoryProvider);
        groupRoleRepository = unitRef.get(GroupRoleRepositoryProvider);
        getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
    });

    it('should be defined', async () => {
        expect(service).toBeDefined();
    });

    it('should join group', async () => {
        const user = mockUser();
        const group = mockGroup();

        const groupRole = mockGroupRole();

        const command = new JoinGroupCommand(
            group.id()
        );

        getAuthenticatedUser.execute.mockResolvedValue(user);
        groupRepository.findById.mockResolvedValue(group);
        groupRoleRepository.findByName.mockResolvedValue(groupRole);
        groupMemberRepository.findBy.mockResolvedValue([]);

        const joined = await service.execute(command);

        expect(joined).toBeInstanceOf(AcceptGroupRequestDto);
    });
});