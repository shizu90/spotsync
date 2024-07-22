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
import { ListGroupMembersService } from '../list-group-members.service';
import { TestBed } from '@automock/jest';
import { mockGroup, mockGroupMember } from './group-mock.helper';
import { Pagination } from 'src/common/common.repository';
import { ListGroupMembersCommand } from '../../ports/in/commands/list-group-members.command';

describe('ListGroupMembersService', () => {
	let service: ListGroupMembersService;
	let groupRepository: jest.Mocked<GroupRepository>;
	let groupMemberRepository: jest.Mocked<GroupMemberRepository>;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(
			ListGroupMembersService,
		).compile();

		service = unit;
		groupRepository = unitRef.get(GroupRepositoryProvider);
		groupMemberRepository = unitRef.get(GroupMemberRepositoryProvider);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should list group members', async () => {
		const group = mockGroup();

		const command = new ListGroupMembersCommand(group.id());

		groupRepository.findById.mockResolvedValueOnce(group);
		groupMemberRepository.paginate.mockResolvedValueOnce(
			new Pagination(
				[mockGroupMember(), mockGroupMember(), mockGroupMember()],
				3,
				0,
			),
		);

		const response = await service.execute(command);

		expect(response.total).toBe(3);
		expect(response.current_page).toBe(0);
		expect(response.next_page).toBe(false);
	});
});
