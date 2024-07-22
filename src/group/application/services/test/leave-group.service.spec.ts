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
import { LeaveGroupService } from '../leave-group.service';
import { TestBed } from '@automock/jest';
import { mockGroup, mockGroupMember } from './group-mock.helper';
import { LeaveGroupCommand } from '../../ports/in/commands/leave-group.command';
import { randomUUID } from 'crypto';
import { GroupMemberNotFoundError } from '../errors/group-member-not-found.error';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { UnableToLeaveGroupError } from '../errors/unable-to-leave-group.error';

describe('LeaveGroupService', () => {
	let service: LeaveGroupService;
	let groupRepository: jest.Mocked<GroupRepository>;
	let groupMemberRepository: jest.Mocked<GroupMemberRepository>;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(LeaveGroupService).compile();

		service = unit;
		groupRepository = unitRef.get(GroupRepositoryProvider);
		groupMemberRepository = unitRef.get(GroupMemberRepositoryProvider);
		getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should leave group', async () => {
		const authenticatedGroupMember = mockGroupMember();

		const command = new LeaveGroupCommand(
			authenticatedGroupMember.group().id(),
		);

		getAuthenticatedUser.execute.mockReturnValue(
			authenticatedGroupMember.user().id(),
		);
		groupRepository.findById.mockResolvedValue(
			authenticatedGroupMember.group(),
		);
		groupMemberRepository.findBy
			.mockResolvedValueOnce([authenticatedGroupMember])
			.mockResolvedValueOnce([
				mockGroupMember(true),
				mockGroupMember(false),
			]);

		await expect(service.execute(command)).resolves.not.toThrow();
	});

	it('should not leave group if user is not a member', async () => {
		const command = new LeaveGroupCommand(randomUUID());

		getAuthenticatedUser.execute.mockReturnValue(randomUUID());
		groupRepository.findById.mockResolvedValue(mockGroup());
		groupMemberRepository.findBy.mockResolvedValueOnce([]);

		await expect(service.execute(command)).rejects.toThrow(
			UnauthorizedAccessError,
		);
	});

	it('should not leave group if group dont have any admin members', async () => {
		const authenticatedGroupMember = mockGroupMember(
			false,
			false,
			'administrator',
		);

		const command = new LeaveGroupCommand(
			authenticatedGroupMember.group().id(),
		);

		getAuthenticatedUser.execute.mockReturnValue(
			authenticatedGroupMember.user().id(),
		);
		groupRepository.findById.mockResolvedValue(
			authenticatedGroupMember.group(),
		);
		groupMemberRepository.findBy
			.mockResolvedValueOnce([authenticatedGroupMember])
			.mockResolvedValueOnce([]);

		await expect(service.execute(command)).rejects.toThrow(
			UnableToLeaveGroupError,
		);
	});
});
