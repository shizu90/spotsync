import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { GroupMemberRepository, GroupMemberRepositoryProvider } from "../../ports/out/group-member.repository";
import { GroupRoleRepository, GroupRoleRepositoryProvider } from "../../ports/out/group-role.repository";
import { GroupRepository, GroupRepositoryProvider } from "../../ports/out/group.repository";
import { JoinGroupService } from "../join-group.service";
import { UserRepository, UserRepositoryProvider } from "src/user/application/ports/out/user.repository";
import { TestBed } from "@automock/jest";
import { mockGroup, mockGroupMember, mockGroupMemberRequest, mockGroupRole, mockUser } from "./group-mock.helper";
import { JoinGroupCommand } from "../../ports/in/commands/join-group.command";
import { AcceptGroupRequestDto } from "../../ports/out/dto/accept-group-request.dto";
import { AlreadyMemberOfGroup } from "../errors/already-member-of-group.error";
import { AlreadyRequestedToJoinError } from "../errors/already-requested-to-join.error";
import { GroupVisibility } from "src/group/domain/group-visibility.enum";

describe("JoinGroupService", () => {
    let service: JoinGroupService;
    let groupRepository: jest.Mocked<GroupRepository>;
    let groupMemberRepository: jest.Mocked<GroupMemberRepository>;
    let groupRoleRepository: jest.Mocked<GroupRoleRepository>;
    let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;
    let userRepository: jest.Mocked<UserRepository>;

    beforeAll(() => {
        const { unit, unitRef } = TestBed.create(JoinGroupService).compile();

        service = unit;
        groupRepository = unitRef.get(GroupRepositoryProvider);
        groupMemberRepository = unitRef.get(GroupMemberRepositoryProvider);
        groupRoleRepository = unitRef.get(GroupRoleRepositoryProvider);
        getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
        userRepository = unitRef.get(UserRepositoryProvider);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should join group', async () => {
        const group = mockGroup();
        const user = mockUser();
        const memberRole = mockGroupRole(true, 'member')

        const command = new JoinGroupCommand(
            group.id()
        );

        getAuthenticatedUser.execute.mockReturnValue(user.id());
        groupRepository.findById.mockResolvedValue(group);
        userRepository.findById.mockResolvedValue(user);
        groupMemberRepository.findBy.mockResolvedValue([]);
        groupMemberRepository.findRequestBy.mockResolvedValue([]);
        groupRoleRepository.findByName.mockResolvedValue(memberRole);

        const response = await service.execute(command);

        expect(response).toBeInstanceOf(AcceptGroupRequestDto);
    });

    it('should not join group if user is already a member', async () => {
        const group = mockGroup();
        const user = mockUser();
        const memberRole = mockGroupRole(true, 'member')

        const command = new JoinGroupCommand(
            group.id()
        );

        getAuthenticatedUser.execute.mockReturnValue(user.id());
        groupRepository.findById.mockResolvedValue(group);
        userRepository.findById.mockResolvedValue(user);
        groupMemberRepository.findBy.mockResolvedValue([mockGroupMember()]);
        groupMemberRepository.findRequestBy.mockResolvedValue([]);
        groupRoleRepository.findByName.mockResolvedValue(memberRole);

        await expect(service.execute(command)).rejects.toThrow(AlreadyMemberOfGroup);
    });

    it('should not join group if user already requested to join', async () => {
        const group = mockGroup();
        group.visibilityConfiguration().changeGroupVisibility(GroupVisibility.PRIVATE);
        const user = mockUser();
        const memberRole = mockGroupRole(true, 'member')

        const command = new JoinGroupCommand(
            group.id()
        );

        getAuthenticatedUser.execute.mockReturnValue(user.id());
        groupRepository.findById.mockResolvedValue(group);
        userRepository.findById.mockResolvedValue(user);
        groupMemberRepository.findBy.mockResolvedValue([]);
        groupMemberRepository.findRequestBy.mockResolvedValue([mockGroupMemberRequest()]);
        groupRoleRepository.findByName.mockResolvedValue(memberRole);

        await expect(service.execute(command)).rejects.toThrow(AlreadyRequestedToJoinError);
    });
});