import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import {
	GroupRepository,
	GroupRepositoryProvider,
} from '../../ports/out/group.repository';
import { UpdateGroupVisibilityService } from '../update-group-visibility.service';
import {
	GroupMemberRepository,
	GroupMemberRepositoryProvider,
} from '../../ports/out/group-member.repository';
import { TestBed } from '@automock/jest';
import { mockGroupMember } from './group-mock.helper';
import { UpdateGroupVisibilityCommand } from '../../ports/in/commands/update-group-visibility.command';
import { GroupVisibility } from 'src/group/domain/group-visibility.enum';
import { GroupNotFoundError } from '../errors/group-not-found.error';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { GroupPermissionName } from 'src/group/domain/group-permission-name.enum';

describe('UpdateGroupVisibilityService', () => {
	let service: UpdateGroupVisibilityService;
	let groupRepository: jest.Mocked<GroupRepository>;
	let groupMemberRepository: jest.Mocked<GroupMemberRepository>;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(
			UpdateGroupVisibilityService,
		).compile();

		service = unit;
		groupRepository = unitRef.get(GroupRepositoryProvider);
		groupMemberRepository = unitRef.get(GroupMemberRepositoryProvider);
		getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should update group visibility', async () => {
		const authenticatedGroupMember = mockGroupMember(true);

		const command = new UpdateGroupVisibilityCommand(
			authenticatedGroupMember.group().id(),
			GroupVisibility.PRIVATE,
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

		await service.execute(command);

		expect(
			authenticatedGroupMember
				.group()
				.visibilityConfiguration()
				.groupVisibility(),
		).toBe(command.groupVisibility);
	});

	it('should not update group visibility if group does not exist', async () => {
		const authenticatedGroupMember = mockGroupMember(true);

		const command = new UpdateGroupVisibilityCommand(
			authenticatedGroupMember.group().id(),
			GroupVisibility.PRIVATE,
		);

		getAuthenticatedUser.execute.mockReturnValue(
			authenticatedGroupMember.user().id(),
		);
		groupRepository.findById.mockResolvedValue(null);
		groupMemberRepository.findBy.mockResolvedValue([
			authenticatedGroupMember,
		]);

		await expect(service.execute(command)).rejects.toThrow(
			GroupNotFoundError,
		);
	});

	it('should not update group visibility if user is not a member of the group', async () => {
		const authenticatedGroupMember = mockGroupMember(true);

		const command = new UpdateGroupVisibilityCommand(
			authenticatedGroupMember.group().id(),
			GroupVisibility.PRIVATE,
		);

		getAuthenticatedUser.execute.mockReturnValue(
			authenticatedGroupMember.user().id(),
		);
		groupRepository.findById.mockResolvedValue(
			authenticatedGroupMember.group(),
		);
		groupMemberRepository.findBy.mockResolvedValue([]);

		await expect(service.execute(command)).rejects.toThrow(
			UnauthorizedAccessError,
		);
	});

	it('should not update group visibility if user does not have permission', async () => {
		const authenticatedGroupMember = mockGroupMember(false);

		authenticatedGroupMember
			.role()
			.removePermission(
				authenticatedGroupMember
					.role()
					.findPermission(GroupPermissionName.UPDATE_SETTINGS),
			);

		const command = new UpdateGroupVisibilityCommand(
			authenticatedGroupMember.group().id(),
			GroupVisibility.PRIVATE,
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
