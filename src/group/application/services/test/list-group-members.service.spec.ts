import { TestBed } from '@automock/jest';
import { Pagination } from 'src/common/core/common.repository';
import { ListGroupMembersCommand } from '../../ports/in/commands/list-group-members.command';
import { GetGroupMemberDto } from '../../ports/out/dto/get-group-member.dto';
import {
	GroupMemberRepository,
	GroupMemberRepositoryProvider,
} from '../../ports/out/group-member.repository';
import {
	GroupRepository,
	GroupRepositoryProvider,
} from '../../ports/out/group.repository';
import { ListGroupMembersService } from '../list-group-members.service';
import { mockGroup, mockGroupMember } from './group-mock.helper';

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

		const command = new ListGroupMembersCommand(
			group.id(),
			null,
			null,
			null,
			null,
			1,
			true,
			10,
		);

		groupRepository.findById.mockResolvedValue(group);
		groupMemberRepository.paginate.mockResolvedValue(
			new Pagination(
				[mockGroupMember(), mockGroupMember(), mockGroupMember()],
				3,
				0,
				10,
			),
		);

		const members = await service.execute(command);

		expect(members).toBeInstanceOf(Pagination<GetGroupMemberDto>);

		if (members instanceof Pagination) {
			expect(members.items).toHaveLength(3);
			expect(members.total).toBe(3);
			expect(members.current_page).toBe(0);
			expect(members.has_next_page).toBeFalsy();
		}
	});
});
