import { TestBed } from '@automock/jest';
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
import { Pagination } from 'src/common/common.repository';
import { GroupLog } from 'src/group/domain/group-log.model';
import { randomUUID } from 'crypto';
import { GetGroupHistoryCommand } from '../../ports/in/commands/get-group-history.command';

describe('GetGroupHistoryService', () => {
	let service: GetGroupHistoryService;
	let groupRepository: jest.Mocked<GroupRepository>;
	let groupMemberRepository: jest.Mocked<GroupMemberRepository>;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(
			GetGroupHistoryService,
		).compile();

		service = unit;
		groupRepository = unitRef.get(GroupRepositoryProvider);
		groupMemberRepository = unitRef.get(GroupMemberRepositoryProvider);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should get group history', async () => {
		const authenticatedGroupMember = mockGroupMember(true);

		const command = new GetGroupHistoryCommand(
			authenticatedGroupMember.group().id(),
		);

		groupRepository.findById.mockResolvedValue(
			authenticatedGroupMember.group(),
		);
		groupMemberRepository.findBy.mockResolvedValue([
			authenticatedGroupMember,
		]);
		groupRepository.paginateLog.mockResolvedValue(
			new Pagination(
				[
					GroupLog.create(
						randomUUID(),
						authenticatedGroupMember.group(),
						'Test log',
					),
				],
				1,
				0,
			),
		);

		const response = await service.execute(command);

		expect(response.total).toBe(1);
		expect(response.current_page).toBe(0);
		expect(response.next_page).toBe(false);
	});
});
