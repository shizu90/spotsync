import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import {
	GroupMemberRepository,
	GroupMemberRepositoryProvider,
} from '../../ports/out/group-member.repository';
import {
	GroupRepository,
	GroupRepositoryProvider,
} from '../../ports/out/group.repository';
import { ChangeMemberRoleService } from '../change-member-role.service';
import {
	GroupRoleRepository,
	GroupRoleRepositoryProvider,
} from '../../ports/out/group-role.repository';
import { TestBed } from '@automock/jest';
import { ChangeMemberRoleCommand } from '../../ports/in/commands/change-member-role.command';
import { mockGroupMember, mockGroupRole } from './group-mock.helper';
import { randomUUID } from 'crypto';
import { GroupNotFoundError } from '../errors/group-not-found.error';
import { GroupMemberNotFoundError } from '../errors/group-member-not-found.error';
import { GroupRoleNotFoundError } from '../errors/group-role-not-found.error';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { GroupPermissionName } from 'src/group/domain/group-permission-name.enum';

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

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should change member role', async () => {
		const groupMember = mockGroupMember();
		const authenticatedGroupMember = mockGroupMember(true);
		const role = mockGroupRole(false, 'administrator');

		const command = new ChangeMemberRoleCommand(
			groupMember.id(),
			groupMember.group().id(),
			role.id(),
		);

		getAuthenticatedUser.execute.mockReturnValue(
			authenticatedGroupMember.user().id(),
		);
		groupRepository.findById.mockResolvedValue(
			authenticatedGroupMember.group(),
		);
		groupMemberRepository.findBy.mockResolvedValue([
			authenticatedGroupMember,
		]);
		groupMemberRepository.findById.mockResolvedValue(groupMember);
		groupRoleRepository.findById.mockResolvedValue(role);

		await service.execute(command);

		expect(groupMember.role().name()).toBe(role.name());
	});

	it('should not change member role if group does not exist', async () => {
		const groupMember = mockGroupMember();
		const role = mockGroupRole(false, 'administrator');

		const command = new ChangeMemberRoleCommand(
			groupMember.id(),
			randomUUID(),
			role.id(),
		);

		getAuthenticatedUser.execute.mockReturnValue(randomUUID());
		groupRepository.findById.mockResolvedValue(null);

		await expect(service.execute(command)).rejects.toThrow(
			GroupNotFoundError,
		);
	});

	it('should not change member role if group member does not exist', async () => {
		const authenticatedGroupMember = mockGroupMember();
		const role = mockGroupRole(false, 'administrator');

		const command = new ChangeMemberRoleCommand(
			randomUUID(),
			authenticatedGroupMember.group().id(),
			role.id(),
		);

		getAuthenticatedUser.execute.mockReturnValue(
			authenticatedGroupMember.user().id(),
		);
		groupRepository.findById.mockResolvedValue(
			authenticatedGroupMember.group(),
		);
		groupMemberRepository.findById.mockResolvedValue(null);

		await expect(service.execute(command)).rejects.toThrow(
			GroupMemberNotFoundError,
		);
	});

	it('should not change member role if role does not exist', async () => {
		const authenticatedGroupMember = mockGroupMember();
		const groupMember = mockGroupMember();

		const command = new ChangeMemberRoleCommand(
			groupMember.id(),
			authenticatedGroupMember.group().id(),
			randomUUID(),
		);

		getAuthenticatedUser.execute.mockReturnValue(
			authenticatedGroupMember.user().id(),
		);
		groupRepository.findById.mockResolvedValue(
			authenticatedGroupMember.group(),
		);
		groupMemberRepository.findBy.mockResolvedValue([
			authenticatedGroupMember,
		]);
		groupMemberRepository.findById.mockResolvedValue(groupMember);
		groupRoleRepository.findById.mockResolvedValue(null);

		await expect(service.execute(command)).rejects.toThrow(
			GroupRoleNotFoundError,
		);
	});

	it('should not change member role if user is not member of the group', async () => {
		const groupMember = mockGroupMember();
		const role = mockGroupRole(false, 'administrator');

		const command = new ChangeMemberRoleCommand(
			groupMember.id(),
			groupMember.group().id(),
			role.id(),
		);

		getAuthenticatedUser.execute.mockReturnValue(randomUUID());
		groupRepository.findById.mockResolvedValue(groupMember.group());
		groupMemberRepository.findBy.mockResolvedValue([]);

		await expect(service.execute(command)).rejects.toThrow(
			UnauthorizedAccessError,
		);
	});

	it('should not change member role if user does not have permission', async () => {
		const authenticatedGroupMember = mockGroupMember(false);

		authenticatedGroupMember
			.role()
			.removePermission(
				authenticatedGroupMember
					.role()
					.findPermission(GroupPermissionName.CHANGE_MEMBER_ROLE),
			);

		const groupMember = mockGroupMember(false);
		const role = mockGroupRole(false, 'administrator');

		const command = new ChangeMemberRoleCommand(
			groupMember.id(),
			groupMember.group().id(),
			role.id(),
		);

		getAuthenticatedUser.execute.mockReturnValue(
			authenticatedGroupMember.user().id(),
		);
		groupRepository.findById.mockResolvedValue(
			authenticatedGroupMember.group(),
		);
		groupMemberRepository.findBy.mockResolvedValue([
			authenticatedGroupMember,
		]);

		await expect(service.execute(command)).rejects.toThrow(
			UnauthorizedAccessError,
		);
	});
});
