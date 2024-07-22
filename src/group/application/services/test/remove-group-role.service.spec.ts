import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
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
import { RemoveGroupRoleService } from '../remove-group-role.service';
import { TestBed } from '@automock/jest';
import { mockGroupMember } from './group-mock.helper';
import { RemoveGroupRoleCommand } from '../../ports/in/commands/remove-group-role.command';
import { GroupNotFoundError } from '../errors/group-not-found.error';
import { GroupRoleNotFoundError } from '../errors/group-role-not-found.error';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { GroupPermissionName } from 'src/group/domain/group-permission-name.enum';

describe('RemoveGroupRoleService', () => {
	let service: RemoveGroupRoleService;
	let groupRepository: jest.Mocked<GroupRepository>;
	let groupMemberRepository: jest.Mocked<GroupMemberRepository>;
	let groupRoleRepository: jest.Mocked<GroupRoleRepository>;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(
			RemoveGroupRoleService,
		).compile();

		service = unit;
		groupRepository = unitRef.get(GroupRepositoryProvider);
		groupMemberRepository = unitRef.get(GroupMemberRepositoryProvider);
		groupRoleRepository = unitRef.get(GroupRoleRepositoryProvider);
		getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should remove group role', async () => {
		const authenticatedGroupMember = mockGroupMember(true);
		const role = authenticatedGroupMember.role();

		const command = new RemoveGroupRoleCommand(
			role.id(),
			authenticatedGroupMember.group().id(),
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
		groupRoleRepository.findById.mockResolvedValue(role);

		await expect(service.execute(command)).resolves.not.toThrow();
	});

	it('should not remove group role if group does not exist', async () => {
		const authenticatedGroupMember = mockGroupMember(true);
		const role = authenticatedGroupMember.role();

		const command = new RemoveGroupRoleCommand(
			role.id(),
			authenticatedGroupMember.group().id(),
		);

		getAuthenticatedUser.execute.mockReturnValue(
			authenticatedGroupMember.user().id(),
		);
		groupRepository.findById.mockResolvedValue(null);
		groupMemberRepository.findBy.mockResolvedValue([
			authenticatedGroupMember,
		]);
		groupRoleRepository.findById.mockResolvedValue(role);

		await expect(service.execute(command)).rejects.toThrow(
			GroupNotFoundError,
		);
	});

	it('should not remove group role if role does not exist', async () => {
		const authenticatedGroupMember = mockGroupMember(true);
		const role = authenticatedGroupMember.role();

		const command = new RemoveGroupRoleCommand(
			role.id(),
			authenticatedGroupMember.group().id(),
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
		groupRoleRepository.findById.mockResolvedValue(null);

		await expect(service.execute(command)).rejects.toThrow(
			GroupRoleNotFoundError,
		);
	});

	it('should not remove group role if user is not a member of the group', async () => {
		const authenticatedGroupMember = mockGroupMember(true);
		const role = authenticatedGroupMember.role();

		const command = new RemoveGroupRoleCommand(
			role.id(),
			authenticatedGroupMember.group().id(),
		);

		getAuthenticatedUser.execute.mockReturnValue(
			authenticatedGroupMember.user().id(),
		);
		groupRepository.findById.mockResolvedValue(
			authenticatedGroupMember.group(),
		);
		groupMemberRepository.findBy.mockResolvedValue([]);
		groupRoleRepository.findById.mockResolvedValue(role);

		await expect(service.execute(command)).rejects.toThrow(
			UnauthorizedAccessError,
		);
	});

	it('should not remove group role if user does not have permission', async () => {
		const authenticatedGroupMember = mockGroupMember(false);

		authenticatedGroupMember
			.role()
			.removePermission(
				authenticatedGroupMember
					.role()
					.findPermission(GroupPermissionName.REMOVE_ROLE),
			);

		const role = authenticatedGroupMember.role();

		const command = new RemoveGroupRoleCommand(
			role.id(),
			authenticatedGroupMember.group().id(),
		);

		getAuthenticatedUser.execute.mockReturnValue(
			authenticatedGroupMember.user().id(),
		);
		groupRepository.findById.mockResolvedValue(
			authenticatedGroupMember.group(),
		);
		groupMemberRepository.findBy.mockResolvedValue([]);
		groupRoleRepository.findById.mockResolvedValue(role);

		await expect(service.execute(command)).rejects.toThrow(
			UnauthorizedAccessError,
		);
	});
});
