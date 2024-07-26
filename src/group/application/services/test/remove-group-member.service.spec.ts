import { TestBed } from '@automock/jest';
import { randomUUID } from 'crypto';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { GroupPermissionName } from 'src/group/domain/group-permission-name.enum';
import { RemoveGroupMemberCommand } from '../../ports/in/commands/remove-group-member.command';
import {
	GroupMemberRepository,
	GroupMemberRepositoryProvider,
} from '../../ports/out/group-member.repository';
import {
	GroupRepository,
	GroupRepositoryProvider,
} from '../../ports/out/group.repository';
import { GroupMemberNotFoundError } from '../errors/group-member-not-found.error';
import { RemoveGroupMemberService } from '../remove-group-member.service';
import { mockGroupMember } from './group-mock.helper';

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

	it('should remove group member', async () => {
		const authenticatedGroupMember = mockGroupMember(
			true,
			true,
			'administrator',
		);
		const groupMember = mockGroupMember(false, false, 'member');

		const command = new RemoveGroupMemberCommand(
			groupMember.id(),
			groupMember.group().id(),
		);

		getAuthenticatedUser.execute.mockResolvedValue(
			authenticatedGroupMember.user(),
		);
		groupRepository.findById.mockResolvedValue(groupMember.group());
		groupMemberRepository.findBy.mockResolvedValue([
			authenticatedGroupMember,
		]);
		groupMemberRepository.findById.mockResolvedValue(groupMember);

		await expect(service.execute(command)).resolves.not.toThrow();
	});

	it('should not remove group member if it does not exist', async () => {
		const authenticatedGroupMember = mockGroupMember(
			true,
			true,
			'administrator',
		);

		const command = new RemoveGroupMemberCommand(
			randomUUID(),
			authenticatedGroupMember.group().id(),
		);

		getAuthenticatedUser.execute.mockResolvedValue(
			authenticatedGroupMember.user(),
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

	it('should not remove group member if user is not authorized', async () => {
		const authenticatedGroupMember = mockGroupMember(
			false,
			false,
			'administrator',
		);
		authenticatedGroupMember
			.role()
			.removePermission(
				authenticatedGroupMember
					.role()
					.findPermission(GroupPermissionName.REMOVE_MEMBER),
			);

		const groupMember = mockGroupMember(false, false, 'member');

		const command = new RemoveGroupMemberCommand(
			groupMember.id(),
			groupMember.group().id(),
		);

		getAuthenticatedUser.execute.mockResolvedValue(
			authenticatedGroupMember.user(),
		);
		groupRepository.findById.mockResolvedValue(groupMember.group());
		groupMemberRepository.findBy.mockResolvedValue([
			authenticatedGroupMember,
		]);
		groupMemberRepository.findById.mockResolvedValue(groupMember);

		await expect(service.execute(command)).rejects.toThrow(
			UnauthorizedAccessError,
		);
	});
});
