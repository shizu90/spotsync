import { TestBed } from '@automock/jest';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { GroupPermissionName } from 'src/group/domain/group-permission-name.enum';
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

	it('should not delete group if user is not authorized', async () => {
		const groupMember = mockGroupMember(false, false, 'adminitrator');

		groupMember.role().removePermission(groupMember.role().findPermission(GroupPermissionName.DELETE_GROUP));

		const command = new DeleteGroupCommand(groupMember.group().id());

		getAuthenticatedUser.execute.mockResolvedValue(groupMember.user());
		groupRepository.findById.mockResolvedValue(groupMember.group());
		groupMemberRepository.findBy.mockResolvedValue([groupMember]);

		await expect(service.execute(command)).rejects.toThrow(UnauthorizedAccessError);
	});
});
