import { TestBed } from '@automock/jest';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UpdateGroupCommand } from '../../ports/in/commands/update-group.command';
import {
	GroupMemberRepository,
	GroupMemberRepositoryProvider,
} from '../../ports/out/group-member.repository';
import {
	GroupRepository,
	GroupRepositoryProvider,
} from '../../ports/out/group.repository';
import { UpdateGroupService } from '../update-group.service';
import { mockGroupMember } from './group-mock.helper';

describe('UpdateGroupService', () => {
	let service: UpdateGroupService;
	let groupRepository: jest.Mocked<GroupRepository>;
	let groupMemberRepository: jest.Mocked<GroupMemberRepository>;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(UpdateGroupService).compile();

		service = unit;
		groupRepository = unitRef.get(GroupRepositoryProvider);
		groupMemberRepository = unitRef.get(GroupMemberRepositoryProvider);
		getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should update group', async () => {
		const groupMember = mockGroupMember(true, true, 'administrator');

		const command = new UpdateGroupCommand(
			groupMember.group().id(),
			'New Group Name',
			'New Group About',
		);

		getAuthenticatedUser.execute.mockResolvedValue(groupMember.user());
		groupRepository.findById.mockResolvedValue(groupMember.group());
		groupMemberRepository.findBy.mockResolvedValue([groupMember]);

		await expect(service.execute(command)).resolves.not.toThrow();
		expect(groupMember.group().name()).toBe(command.name);
		expect(groupMember.group().about()).toBe(command.about);
	});
});
