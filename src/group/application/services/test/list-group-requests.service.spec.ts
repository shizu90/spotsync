import { TestBed } from '@automock/jest';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { Pagination } from 'src/common/core/common.repository';
import { ListGroupRequestsCommand } from '../../ports/in/commands/list-group-requests.command';
import { GetGroupRequestDto } from '../../ports/out/dto/get-group-request.dto';
import {
	GroupMemberRepository,
	GroupMemberRepositoryProvider,
} from '../../ports/out/group-member.repository';
import {
	GroupRepository,
	GroupRepositoryProvider,
} from '../../ports/out/group.repository';
import { ListGroupRequestsService } from '../list-group-requests.service';
import { mockGroupMember, mockGroupMemberRequest } from './group-mock.helper';

describe('ListGroupRequestsService', () => {
	let service: ListGroupRequestsService;
	let groupRepository: jest.Mocked<GroupRepository>;
	let groupMemberRepository: jest.Mocked<GroupMemberRepository>;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(
			ListGroupRequestsService,
		).compile();

		service = unit;
		groupRepository = unitRef.get(GroupRepositoryProvider);
		groupMemberRepository = unitRef.get(GroupMemberRepositoryProvider);
		getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should list group requests', async () => {
		const groupMember = mockGroupMember(true, true, 'administrator');

		const command = new ListGroupRequestsCommand(
			groupMember.group().id(),
			null,
			null,
			null,
			true,
		);

		getAuthenticatedUser.execute.mockResolvedValue(groupMember.user());
		groupRepository.findById.mockResolvedValue(groupMember.group());
		groupMemberRepository.findBy.mockResolvedValue([groupMember]);
		groupMemberRepository.paginateRequest.mockResolvedValue(
			new Pagination(
				[mockGroupMemberRequest(), mockGroupMemberRequest()],
				2,
				0,
				10,
			),
		);

		const requests = await service.execute(command);

		expect(requests).toBeInstanceOf(Pagination<GetGroupRequestDto>);

		if (requests instanceof Pagination) {
			expect(requests.items).toHaveLength(2);
			expect(requests.total).toBe(2);
			expect(requests.current_page).toBe(0);
			expect(requests.has_next_page).toBeFalsy();
		}
	});
});
