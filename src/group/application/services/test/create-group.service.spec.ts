import { TestBed } from '@automock/jest';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { CreateGroupCommand } from '../../ports/in/commands/create-group.command';
import { CreateGroupDto } from '../../ports/out/dto/create-group.dto';
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
import { CreateGroupService } from '../create-group.service';
import { mockGroupRole, mockUser } from './group-mock.helper';

describe('CreateGroupService', () => {
	let service: CreateGroupService;
	let groupRepository: jest.Mocked<GroupRepository>;
	let groupMemberRepository: jest.Mocked<GroupMemberRepository>;
	let groupRoleRepository: jest.Mocked<GroupRoleRepository>;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(CreateGroupService).compile();

		service = unit;
		groupRepository = unitRef.get(GroupRepositoryProvider);
		groupMemberRepository = unitRef.get(GroupMemberRepositoryProvider);
		groupRoleRepository = unitRef.get(GroupRoleRepositoryProvider);
		getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should create a group', async () => {
		const user = mockUser();
		const adminRole = mockGroupRole(true, 'administrator');

		const command = new CreateGroupCommand('Test Name', 'Test About');

		getAuthenticatedUser.execute.mockResolvedValue(user);
		groupRoleRepository.findByName.mockResolvedValue(adminRole);

		const group = await service.execute(command);

		expect(group).toBeInstanceOf(CreateGroupDto);
	});
});
