import { TestBed } from '@automock/jest';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { ChangeMemberRoleCommand } from '../../ports/in/commands/change-member-role.command';
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
import { ChangeMemberRoleService } from '../change-member-role.service';
import { mockGroupMember, mockGroupRole } from './group-mock.helper';

describe('ChangeMemberRoleService', () => {
	let service: ChangeMemberRoleService;
	let groupMemberRepository: jest.Mocked<GroupMemberRepository>;
	let groupRepository: jest.Mocked<GroupRepository>;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;
	let groupRoleRepository: jest.Mocked<GroupRoleRepository>;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(
			ChangeMemberRoleService,
		).compile();

		service = unit;
		groupMemberRepository = unitRef.get(GroupMemberRepositoryProvider);
		groupRepository = unitRef.get(GroupRepositoryProvider);
		getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
		groupRoleRepository = unitRef.get(GroupRoleRepositoryProvider);
	});

	it('should be defined', async () => {
		expect(service).toBeDefined();
	});

	it('should change member role', async () => {
		const authenticatedGroupMember = mockGroupMember(
			true,
			true,
			'administrator',
		);
		const groupMember = mockGroupMember(false, true, 'member');
		const groupRole = mockGroupRole();

		const command = new ChangeMemberRoleCommand(
			groupMember.id(),
			groupMember.group().id(),
			groupRole.id(),
		);

		getAuthenticatedUser.execute.mockResolvedValue(
			authenticatedGroupMember.user(),
		);
		groupRepository.findById.mockResolvedValue(groupMember.group());
		groupMemberRepository.findBy.mockResolvedValue([
			authenticatedGroupMember,
		]);
		groupMemberRepository.findById.mockResolvedValue(groupMember);
		groupRoleRepository.findById.mockResolvedValue(groupRole);

		await expect(service.execute(command)).resolves.not.toThrow();
		expect(groupMember.role()).toEqual(groupRole);
	});
});
