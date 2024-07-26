import { TestBed } from '@automock/jest';
import { randomUUID } from 'crypto';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { GroupPermissionName } from 'src/group/domain/group-permission-name.enum';
import { AcceptGroupRequestCommand } from '../../ports/in/commands/accept-group-request.command';
import { AcceptGroupRequestDto } from '../../ports/out/dto/accept-group-request.dto';
import {
	GroupMemberRepository,
	GroupMemberRepositoryProvider,
} from '../../ports/out/group-member.repository';
import {
	GroupRoleRepository,
	GroupRoleRepositoryProvider,
} from '../../ports/out/group-role.repository';
import {
	GroupRepository,
	GroupRepositoryProvider,
} from '../../ports/out/group.repository';
import { AcceptGroupRequestService } from '../accept-group-request.service';
import { GroupRequestNotFoundError } from '../errors/group-request-not-found.error';
import {
	mockGroupMember,
	mockGroupMemberRequest,
	mockGroupRole,
} from './group-mock.helper';

describe('AcceptGroupRequestService', () => {
	let service: AcceptGroupRequestService;
	let groupMemberRepository: jest.Mocked<GroupMemberRepository>;
	let groupRepository: jest.Mocked<GroupRepository>;
	let groupRoleRepository: jest.Mocked<GroupRoleRepository>;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(
			AcceptGroupRequestService,
		).compile();

		service = unit;
		groupMemberRepository = unitRef.get(GroupMemberRepositoryProvider);
		groupRepository = unitRef.get(GroupRepositoryProvider);
		groupRoleRepository = unitRef.get(GroupRoleRepositoryProvider);
		getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
	});

	it('should be defined', async () => {
		expect(service).toBeDefined();
	});

	it('should accept group request', async () => {
		const groupMemberRequest = mockGroupMemberRequest();
		const group = groupMemberRequest.group();
		const authenticatedGroupMember = mockGroupMember(true, false, 'administrator');
		const groupRole = mockGroupRole();

		const command = new AcceptGroupRequestCommand(
			groupMemberRequest.id(),
			group.id(),
		);

		getAuthenticatedUser.execute.mockResolvedValue(authenticatedGroupMember.user());
		groupRepository.findById.mockResolvedValue(group);
		groupMemberRepository.findBy.mockResolvedValue([authenticatedGroupMember]);
		groupMemberRepository.findRequestById.mockResolvedValue(groupMemberRequest);
		groupRoleRepository.findByName.mockResolvedValue(groupRole);

		const member = await service.execute(command);

		expect(member).toBeInstanceOf(AcceptGroupRequestDto);
		expect(member.group_id).toBe(group.id());
	});

	it('should not accept group request if user is not authorized', async () => {
		const groupMemberRequest = mockGroupMemberRequest();
		const group = groupMemberRequest.group();
		const authenticatedGroupMember = mockGroupMember(false, false, 'administrator');
		
		authenticatedGroupMember.role().removePermission(authenticatedGroupMember.role().findPermission(GroupPermissionName.ACCEPT_REQUESTS));

		const command = new AcceptGroupRequestCommand(
			groupMemberRequest.id(),
			group.id()
		);

		getAuthenticatedUser.execute.mockResolvedValue(authenticatedGroupMember.user());
		groupRepository.findById.mockResolvedValue(group);
		groupMemberRepository.findBy.mockResolvedValue([authenticatedGroupMember]);

		await expect(service.execute(command)).rejects.toThrow(UnauthorizedAccessError);
	});

	it('should not accept group request if it does not exist', async () => {
		const authenticatedGroupMember = mockGroupMember(true, true, 'administrator');
		const group = authenticatedGroupMember.group();

		const command = new AcceptGroupRequestCommand(
			randomUUID(),
			group.id()
		);

		getAuthenticatedUser.execute.mockResolvedValue(authenticatedGroupMember.user());
		groupRepository.findById.mockResolvedValue(group);
		groupMemberRepository.findBy.mockResolvedValue([authenticatedGroupMember]);
		groupMemberRepository.findRequestById.mockResolvedValue(null);

		await expect(service.execute(command)).rejects.toThrow(GroupRequestNotFoundError);
	});
});
