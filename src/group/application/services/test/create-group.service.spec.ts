import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import {
	GroupRepository,
	GroupRepositoryProvider,
} from '../../ports/out/group.repository';
import { CreateGroupService } from '../create-group.service';
import { TestBed } from '@automock/jest';
import {
	UserRepository,
	UserRepositoryProvider,
} from 'src/user/application/ports/out/user.repository';
import {
	GroupMemberRepository,
	GroupMemberRepositoryProvider,
} from '../../ports/out/group-member.repository';
import {
	GroupRoleRepository,
	GroupRoleRepositoryProvider,
} from '../../ports/out/group-role.repository';
import { mockGroupRole, mockUser } from './group-mock.helper';
import { CreateGroupCommand } from '../../ports/in/commands/create-group.command';

describe('CreateGroupService', () => {
	let service: CreateGroupService;
	let groupRepository: jest.Mocked<GroupRepository>;
	let userRepository: jest.Mocked<UserRepository>;
	let groupMemberRepository: jest.Mocked<GroupMemberRepository>;
	let groupRoleRepository: jest.Mocked<GroupRoleRepository>;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(CreateGroupService).compile();

		service = unit;
		groupRepository = unitRef.get(GroupRepositoryProvider);
		getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
		userRepository = unitRef.get(UserRepositoryProvider);
		groupMemberRepository = unitRef.get(GroupMemberRepositoryProvider);
		groupRoleRepository = unitRef.get(GroupRoleRepositoryProvider);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should create group', async () => {
		const user = mockUser();
		const adminRole = mockGroupRole(true, 'administrator');

		const command = new CreateGroupCommand('Test Group', 'Test About');

		getAuthenticatedUser.execute.mockReturnValue(user.id());
		userRepository.findById.mockResolvedValue(user);
		groupRoleRepository.findByName.mockResolvedValue(adminRole);

		const response = await service.execute(command);

		expect(response.name).toBe(command.name);
		expect(response.about).toBe(command.about);
	});
});
