import { TestBed } from '@automock/jest';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { Pagination } from 'src/common/common.repository';
import { ListGroupsCommand } from '../../ports/in/commands/list-groups.command';
import { GetGroupDto } from '../../ports/out/dto/get-group.dto';
import {
	GroupMemberRepository,
	GroupMemberRepositoryProvider,
} from '../../ports/out/group-member.repository';
import {
	GroupRepository,
	GroupRepositoryProvider,
} from '../../ports/out/group.repository';
import { ListGroupsService } from '../list-groups.service';
import { mockGroup, mockUser } from './group-mock.helper';

describe('ListGroupsService', () => {
	let service: ListGroupsService;
	let groupRepository: jest.Mocked<GroupRepository>;
	let groupMemberRepository: jest.Mocked<GroupMemberRepository>;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(ListGroupsService).compile();

		service = unit;
		groupRepository = unitRef.get(GroupRepositoryProvider);
		groupMemberRepository = unitRef.get(GroupMemberRepositoryProvider);
		getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should list groups', async () => {
		const user = mockUser();

		const command = new ListGroupsCommand();

		getAuthenticatedUser.execute.mockResolvedValue(user);
		groupRepository.paginate.mockResolvedValue(
			new Pagination([mockGroup(), mockGroup()], 2, 0),
		);
		groupMemberRepository.findBy.mockResolvedValue([]);

		const groups = await service.execute(command);

		expect(groups).toBeInstanceOf(Pagination<GetGroupDto>);
		expect(groups.items).toHaveLength(2);
		expect(groups.total).toBe(2);
		expect(groups.current_page).toBe(0);
		expect(groups.next_page).toBeFalsy();
	});
});
