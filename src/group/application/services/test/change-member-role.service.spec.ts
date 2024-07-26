import { TestBed } from '@automock/jest';
import { randomUUID } from 'crypto';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { GroupPermissionName } from 'src/group/domain/group-permission-name.enum';
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
import { GroupMemberNotFoundError } from '../errors/group-member-not-found.error';
import { GroupRoleNotFoundError } from '../errors/group-role-not-found.error';
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
		const group = groupMember.group();
		const groupRole = mockGroupRole();

		const command = new ChangeMemberRoleCommand(
			groupMember.id(),
			group.id(),
			groupRole.id(),
		);

		getAuthenticatedUser.execute.mockResolvedValue(
			authenticatedGroupMember.user(),
		);
		groupRepository.findById.mockResolvedValue(group);
		groupMemberRepository.findBy.mockResolvedValue([
			authenticatedGroupMember,
		]);
		groupMemberRepository.findById.mockResolvedValue(groupMember);
		groupRoleRepository.findById.mockResolvedValue(groupRole);

		await expect(service.execute(command)).resolves.not.toThrow();
		expect(groupMember.role()).toEqual(groupRole);
	});

	it('should not change member role if user is not authorized', async () => {
		const authenticatedGroupMember = mockGroupMember(
			false,
			false,
			'administrator',
		);

		authenticatedGroupMember.role().removePermission(authenticatedGroupMember.role().findPermission(GroupPermissionName.CHANGE_MEMBER_ROLE));

		const groupMember = mockGroupMember(false, false, 'member');
		const group = groupMember.group();
		const groupRole = mockGroupRole();

		const command = new ChangeMemberRoleCommand(
			groupMember.id(),
			group.id(),
			groupRole.id(),
		);

		getAuthenticatedUser.execute.mockResolvedValue(
			authenticatedGroupMember.user(),
		);
		groupRepository.findById.mockResolvedValue(group);
		groupMemberRepository.findBy.mockResolvedValue([
			authenticatedGroupMember,
		]);
		groupMemberRepository.findById.mockResolvedValue(groupMember);

		await expect(service.execute(command)).rejects.toThrow(UnauthorizedAccessError);
	});

	it('should not change member role if role does not exist', async () => {
		const authenticatedGroupMember = mockGroupMember(true, true, 'administrator');
		const groupMember = mockGroupMember(false, true, 'member');
		const group = groupMember.group();

		const command = new ChangeMemberRoleCommand(
			groupMember.id(),
			group.id(),
			randomUUID()
		);

		getAuthenticatedUser.execute.mockResolvedValue(
			authenticatedGroupMember.user(),
		);
		groupRepository.findById.mockResolvedValue(group);
		groupMemberRepository.findBy.mockResolvedValue([
			authenticatedGroupMember,
		]);
		groupMemberRepository.findById.mockResolvedValue(groupMember);
		groupRoleRepository.findById.mockResolvedValue(null);

		await expect(service.execute(command)).rejects.toThrow(GroupRoleNotFoundError);
	});

	it('should not change member role if member does not exist', async () => {
		const authenticatedGroupMember = mockGroupMember(true, true, 'administrator');
		const group = authenticatedGroupMember.group();

		const command = new ChangeMemberRoleCommand(
			randomUUID(),
			group.id(),
			randomUUID()
		);

		getAuthenticatedUser.execute.mockResolvedValue(
			authenticatedGroupMember.user(),
		);
		groupRepository.findById.mockResolvedValue(group);
		groupMemberRepository.findBy.mockResolvedValue([
			authenticatedGroupMember,
		]);
		groupMemberRepository.findById.mockResolvedValue(null);

		await expect(service.execute(command)).rejects.toThrow(GroupMemberNotFoundError);
	});
});
