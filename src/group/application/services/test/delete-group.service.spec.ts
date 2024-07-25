import { TestBed } from '@automock/jest';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { DeleteGroupCommand } from '../../ports/in/commands/delete-group.command';
import {
	GroupMemberRepository,
	GroupMemberRepositoryProvider,
} from '../../ports/out/group-member.repository';
import {
	GroupRepository,
	GroupRepositoryProvider,
} from '../../ports/out/group.repository';
import { DeleteGroupService } from '../delete-group.service';
import { mockGroupMember } from './group-mock.helper';

describe('DeleteGroupService', () => {
	let service: DeleteGroupService;
	let groupRepository: jest.Mocked<GroupRepository>;
	let groupMemberRepository: jest.Mocked<GroupMemberRepository>;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(DeleteGroupService).compile();

		service = unit;
		groupRepository = unitRef.get(GroupRepositoryProvider);
		groupMemberRepository = unitRef.get(GroupMemberRepositoryProvider);
		getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should delete group', async () => {
		const groupMember = mockGroupMember(true, true, 'administrator');

		const command = new DeleteGroupCommand(groupMember.group().id());

		getAuthenticatedUser.execute.mockResolvedValue(groupMember.user());
		groupRepository.findById.mockResolvedValue(groupMember.group());
		groupMemberRepository.findBy.mockResolvedValue([groupMember]);

		await expect(service.execute(command)).resolves.not.toThrow();
	});
});
