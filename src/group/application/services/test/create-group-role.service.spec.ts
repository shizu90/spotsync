import { TestBed } from '@automock/jest';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { GroupPermissionName } from 'src/group/domain/group-permission-name.enum';
import { CreateGroupRoleCommand } from '../../ports/in/commands/create-group-role.command';
import { CreateGroupRoleDto } from '../../ports/out/dto/create-group-role.dto';
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
import { CreateGroupRoleService } from '../create-group-role.service';
import { mockGroupMember } from './group-mock.helper';

describe('CreateGroupRoleService', () => {
	let service: CreateGroupRoleService;
	let groupRoleRepository: jest.Mocked<GroupRoleRepository>;
	let groupRepository: jest.Mocked<GroupRepository>;
	let groupMemberRepository: jest.Mocked<GroupMemberRepository>;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(
			CreateGroupRoleService,
		).compile();

		service = unit;
		groupRoleRepository = unitRef.get(GroupRoleRepositoryProvider);
		groupRepository = unitRef.get(GroupRepositoryProvider);
		groupMemberRepository = unitRef.get(GroupMemberRepositoryProvider);
		getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
	});

	it('should be defined', async () => {
		expect(service).toBeDefined();
	});

	it('should create group role', async () => {
		const groupMember = mockGroupMember(true, true, 'administrator');

		const command = new CreateGroupRoleCommand(
			groupMember.group().id(),
			'New Role',
			'#000000',
			[],
		);

		getAuthenticatedUser.execute.mockResolvedValue(groupMember.user());
		groupRepository.findById.mockResolvedValue(groupMember.group());
		groupMemberRepository.findBy.mockResolvedValue([groupMember]);
		groupRoleRepository.findByName.mockResolvedValue(null);

		const role = await service.execute(command);

		expect(role).toBeInstanceOf(CreateGroupRoleDto);
		expect(role.name).toBe(command.name);
	});

	it('should not create group role if user is not authorized', async () => {
		const groupMember = mockGroupMember(false, false, 'adminitrator');

		groupMember
			.role()
			.removePermission(
				groupMember
					.role()
					.findPermission(GroupPermissionName.CREATE_ROLE),
			);

		const command = new CreateGroupRoleCommand(
			groupMember.group().id(),
			'New Role',
			'#000000',
			[],
		);

		getAuthenticatedUser.execute.mockResolvedValue(groupMember.user());
		groupRepository.findById.mockResolvedValue(groupMember.group());
		groupMemberRepository.findBy.mockResolvedValue([groupMember]);

		await expect(service.execute(command)).rejects.toThrow(
			UnauthorizedAccessError,
		);
	});
});
