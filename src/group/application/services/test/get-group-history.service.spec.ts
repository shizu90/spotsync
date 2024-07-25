import { TestBed } from '@automock/jest';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { Pagination } from 'src/common/common.repository';
import { GetGroupHistoryCommand } from '../../ports/in/commands/get-group-history.command';
import { GetGroupLogDto } from '../../ports/out/dto/get-group-log.dto';
import {
	GroupMemberRepository,
	GroupMemberRepositoryProvider,
} from '../../ports/out/group-member.repository';
import {
	GroupRepository,
	GroupRepositoryProvider,
} from '../../ports/out/group.repository';
import { GetGroupHistoryService } from '../get-group-history.service';
import { mockGroupMember } from './group-mock.helper';

describe('GetGroupHistoryService', () => {
	let service: GetGroupHistoryService;
	let groupRepository: jest.Mocked<GroupRepository>;
	let groupMemberRepository: jest.Mocked<GroupMemberRepository>;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(
			GetGroupHistoryService,
		).compile();

		service = unit;
		groupRepository = unitRef.get(GroupRepositoryProvider);
		groupMemberRepository = unitRef.get(GroupMemberRepositoryProvider);
		getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should get group history', async () => {
		const groupMember = mockGroupMember(true, true, 'administrator');

		const command = new GetGroupHistoryCommand(groupMember.group().id());

		getAuthenticatedUser.execute.mockResolvedValue(groupMember.user());
		groupRepository.findById.mockResolvedValue(groupMember.group());
		groupMemberRepository.findBy.mockResolvedValue([groupMember]);
		groupRepository.paginateLog.mockResolvedValue(new Pagination([], 0, 0));

		const history = await service.execute(command);

		expect(history).toBeInstanceOf(Pagination<GetGroupLogDto>);
		expect(history.items).toHaveLength(0);
		expect(history.total).toBe(0);
		expect(history.current_page).toBe(0);
		expect(history.next_page).toBeFalsy();
	});
});
