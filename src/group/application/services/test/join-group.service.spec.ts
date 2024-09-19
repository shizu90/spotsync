import { TestBed } from '@automock/jest';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { GroupMemberStatus } from 'src/group/domain/group-member-status.enum';
import { GroupVisibility } from 'src/group/domain/group-visibility.enum';
import { JoinGroupCommand } from '../../ports/in/commands/join-group.command';
import { JoinGroupDto } from '../../ports/out/dto/join-group.dto';
import {
	GroupMemberRepository,
	GroupMemberRepositoryProvider,
} from '../../ports/out/group-member.repository';
import {
	GroupRoleRepository,
	GroupRoleRepositoryProvider,
} from '../../ports/out/group-role.repository';
import {
	GroupRepository,
	GroupRepositoryProvider,
} from '../../ports/out/group.repository';
import { AlreadyMemberOfGroupError } from '../errors/already-member-of-group.error';
import { AlreadyRequestedToJoinError } from '../errors/already-requested-to-join.error';
import { JoinGroupService } from '../join-group.service';
import {
	mockGroup,
	mockGroupMember,
	mockGroupRole,
	mockUser,
} from './group-mock.helper';

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

		const command = new JoinGroupCommand(group.id());

		getAuthenticatedUser.execute.mockResolvedValue(user);
		groupRepository.findById.mockResolvedValue(group);
		groupRoleRepository.findByName.mockResolvedValue(groupRole);
		groupMemberRepository.findBy.mockResolvedValue([]);

		const joined = await service.execute(command);

		expect(joined).toBeInstanceOf(JoinGroupDto);
	});

	it('should request to join group', async () => {
		const user = mockUser();
		const group = mockGroup();

		group
			.visibilitySettings()
			.changeGroups(GroupVisibility.PRIVATE);

		const groupRole = mockGroupRole();

		const command = new JoinGroupCommand(group.id());

		getAuthenticatedUser.execute.mockResolvedValue(user);
		groupRepository.findById.mockResolvedValue(group);
		groupRoleRepository.findByName.mockResolvedValue(groupRole);
		groupMemberRepository.findBy.mockResolvedValue([]);

		const joined = await service.execute(command);

		expect(joined).toBeInstanceOf(JoinGroupDto);
	});

	it('should not join group if already a member', async () => {
		const user = mockUser();
		const group = mockGroup();
		const groupRole = mockGroupRole();

		const command = new JoinGroupCommand(group.id());

		getAuthenticatedUser.execute.mockResolvedValue(user);
		groupRepository.findById.mockResolvedValue(group);
		groupRoleRepository.findByName.mockResolvedValue(groupRole);
		groupMemberRepository.findBy.mockResolvedValue([mockGroupMember()]);

		await expect(service.execute(command)).rejects.toThrow(
			AlreadyMemberOfGroupError,
		);
	});

	it('should not request to join group if already requested', async () => {
		const user = mockUser();
		const group = mockGroup();
		const groupRole = mockGroupRole();

		group
			.visibilitySettings()
			.changeGroups(GroupVisibility.PRIVATE);

		const command = new JoinGroupCommand(group.id());

		getAuthenticatedUser.execute.mockResolvedValue(user);
		groupRepository.findById.mockResolvedValue(group);
		groupRoleRepository.findByName.mockResolvedValue(groupRole);
		groupMemberRepository.findBy.mockResolvedValue([
			mockGroupMember(false, false, 'member', GroupMemberStatus.REQUESTED)
		]);

		await expect(service.execute(command)).rejects.toThrow(
			AlreadyRequestedToJoinError,
		);
	});

	it('should not request to join group if already a member', async () => {
		const user = mockUser();
		const group = mockGroup();
		const groupRole = mockGroupRole();

		group
			.visibilitySettings()
			.changeGroups(GroupVisibility.PRIVATE);

		const command = new JoinGroupCommand(group.id());

		const groupMember = mockGroupMember(
			false,
			false,
			'member',
			GroupMemberStatus.ACTIVE,
		);

		console.log(groupMember.status() == GroupMemberStatus.ACTIVE);

		getAuthenticatedUser.execute.mockResolvedValue(user);
		groupRepository.findById.mockResolvedValue(group);
		groupRoleRepository.findByName.mockResolvedValue(groupRole);
		groupMemberRepository.findBy
			.mockResolvedValue([groupMember]);

		await expect(service.execute(command)).rejects.toThrow(
			AlreadyMemberOfGroupError,
		);
	});
});
