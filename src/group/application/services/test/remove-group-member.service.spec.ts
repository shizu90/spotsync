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
import { RemoveGroupMemberService } from '../remove-group-member.service';
import { TestBed } from '@automock/jest';
import { mockGroupMember } from './group-mock.helper';
import { RemoveGroupMemberCommand } from '../../ports/in/commands/remove-group-member.command';
import { GroupNotFoundError } from '../errors/group-not-found.error';
import { GroupMemberNotFoundError } from '../errors/group-member-not-found.error';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { GroupPermissionName } from 'src/group/domain/group-permission-name.enum';

describe('RemoveGroupMemberService', () => {
	let service: RemoveGroupMemberService;
	let groupRepository: jest.Mocked<GroupRepository>;
	let groupMemberRepository: jest.Mocked<GroupMemberRepository>;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(
			RemoveGroupMemberService,
		).compile();

		service = unit;
		groupRepository = unitRef.get(GroupRepositoryProvider);
		groupMemberRepository = unitRef.get(GroupMemberRepositoryProvider);
		getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should remove member', async () => {
		const authenticatedGroupMember = mockGroupMember(true);
		const groupMember = mockGroupMember(false);

		const command = new RemoveGroupMemberCommand(
			groupMember.id(),
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
		groupMemberRepository.findById.mockResolvedValue(groupMember);

		await expect(service.execute(command)).resolves.not.toThrow();
	});

	it('should not remove member if group does not exist', async () => {
		const authenticatedGroupMember = mockGroupMember(true);
		const groupMember = mockGroupMember(false);

		const command = new RemoveGroupMemberCommand(
			groupMember.id(),
			authenticatedGroupMember.group().id(),
		);

		getAuthenticatedUser.execute.mockReturnValue(
			authenticatedGroupMember.user().id(),
		);
		groupRepository.findById.mockResolvedValue(null);
		groupMemberRepository.findBy.mockResolvedValue([
			authenticatedGroupMember,
		]);
		groupMemberRepository.findById.mockResolvedValue(groupMember);

		await expect(service.execute(command)).rejects.toThrow(
			GroupNotFoundError,
		);
	});

	it('should not remove member if member does not exist', async () => {
		const authenticatedGroupMember = mockGroupMember(true);
		const groupMember = mockGroupMember(false);

		const command = new RemoveGroupMemberCommand(
			groupMember.id(),
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
		groupMemberRepository.findById.mockResolvedValue(null);

		await expect(service.execute(command)).rejects.toThrow(
			GroupMemberNotFoundError,
		);
	});

	it('should not remove member if user is not a member of the group', async () => {
		const authenticatedGroupMember = mockGroupMember(true);
		const groupMember = mockGroupMember(false);

		const command = new RemoveGroupMemberCommand(
			groupMember.id(),
			authenticatedGroupMember.group().id(),
		);

		getAuthenticatedUser.execute.mockReturnValue(
			authenticatedGroupMember.user().id(),
		);
		groupRepository.findById.mockResolvedValue(
			authenticatedGroupMember.group(),
		);
		groupMemberRepository.findBy.mockResolvedValue([]);
		groupMemberRepository.findById.mockResolvedValue(groupMember);

		await expect(service.execute(command)).rejects.toThrow(
			UnauthorizedAccessError,
		);
	});

	it('should not remove member if user does not have permission', async () => {
		const authenticatedGroupMember = mockGroupMember(false);

		authenticatedGroupMember
			.role()
			.removePermission(
				authenticatedGroupMember
					.role()
					.findPermission(GroupPermissionName.REMOVE_MEMBER),
			);

		const groupMember = mockGroupMember(false);

		const command = new RemoveGroupMemberCommand(
			groupMember.id(),
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
		groupMemberRepository.findById.mockResolvedValue(groupMember);

		await expect(service.execute(command)).rejects.toThrow(
			UnauthorizedAccessError,
		);
	});
});
