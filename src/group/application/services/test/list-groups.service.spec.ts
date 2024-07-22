import { TestBed } from '@automock/jest';
import {
	GroupMemberRepository,
	GroupMemberRepositoryProvider,
} from '../../ports/out/group-member.repository';
import {
	GroupRepository,
	GroupRepositoryProvider,
} from '../../ports/out/group.repository';
import { ListGroupsService } from '../list-groups.service';
import { Pagination } from 'src/common/common.repository';
import { mockGroup } from './group-mock.helper';
import { ListGroupsCommand } from '../../ports/in/commands/list-groups.command';

describe('ListGroupsService', () => {
	let service: ListGroupsService;
	let groupRepository: jest.Mocked<GroupRepository>;
	let groupMemberRepository: jest.Mocked<GroupMemberRepository>;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(ListGroupsService).compile();

		service = unit;
		groupRepository = unitRef.get(GroupRepositoryProvider);
		groupMemberRepository = unitRef.get(GroupMemberRepositoryProvider);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should list groups', async () => {
		const command = new ListGroupsCommand();

		groupMemberRepository.findBy.mockResolvedValue([]);
		groupRepository.paginate.mockResolvedValue(
			new Pagination([mockGroup(), mockGroup()], 2, 0),
		);

		const response = await service.execute(command);

		expect(response.total).toBe(2);
		expect(response.current_page).toBe(0);
		expect(response.next_page).toBe(false);
	});
});
