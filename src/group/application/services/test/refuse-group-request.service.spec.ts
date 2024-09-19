import { TestBed } from '@automock/jest';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { RefuseGroupRequestCommand } from '../../ports/in/commands/refuse-group-request.command';
import {
	GroupMemberRepository,
	GroupMemberRepositoryProvider,
} from '../../ports/out/group-member.repository';
import {
	GroupRepository,
	GroupRepositoryProvider,
} from '../../ports/out/group.repository';
import { RefuseGroupRequestService } from '../refuse-group-request.service';
import { mockGroupMember } from './group-mock.helper';

describe('RefuseGroupRequestService', () => {
	let service: RefuseGroupRequestService;
	let groupRepository: jest.Mocked<GroupRepository>;
	let groupMemberRepository: jest.Mocked<GroupMemberRepository>;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(
			RefuseGroupRequestService,
		).compile();

		service = unit;
		groupRepository = unitRef.get(GroupRepositoryProvider);
		groupMemberRepository = unitRef.get(GroupMemberRepositoryProvider);
		getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should refuse group request', async () => {
		const groupMember = mockGroupMember(true, true, 'administrator');
		const groupRequest = mockGroupMember();

		const command = new RefuseGroupRequestCommand(
			groupRequest.id(),
			groupRequest.group().id(),
		);

		getAuthenticatedUser.execute.mockResolvedValue(groupMember.user());
		groupRepository.findById.mockResolvedValue(groupRequest.group());
		groupMemberRepository.findBy
			.mockRejectedValueOnce([groupMember])
			.mockResolvedValueOnce([groupRequest]);

		await expect(service.execute(command)).resolves.not.toThrow();
	});
});
