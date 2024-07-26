import { TestBed } from '@automock/jest';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { GetGroupRoleCommand } from '../../ports/in/commands/get-group-role.command';
import { GetGroupRoleDto } from '../../ports/out/dto/get-group-role.dto';
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
import { GetGroupRoleService } from '../get-group-role.service';
import { mockGroupMember, mockGroupRole } from './group-mock.helper';

describe('GetGroupRoleService', () => {
	let service: GetGroupRoleService;
	let groupRoleRepository: jest.Mocked<GroupRoleRepository>;
	let groupRepository: jest.Mocked<GroupRepository>;
	let groupMemberRepository: jest.Mocked<GroupMemberRepository>;
	let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

	beforeAll(() => {
		const { unit, unitRef } = TestBed.create(GetGroupRoleService).compile();

		service = unit;
		groupRoleRepository = unitRef.get(GroupRoleRepositoryProvider);
		groupRepository = unitRef.get(GroupRepositoryProvider);
		groupMemberRepository = unitRef.get(GroupMemberRepositoryProvider);
		getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
	});

	it('should be defined', async () => {
		expect(service).toBeDefined();
	});

	it('should get group role', async () => {
		const groupMember = mockGroupMember(true, true, 'adminitrator');
		const groupRole = mockGroupRole();

		const command = new GetGroupRoleCommand(
			groupRole.id(),
			groupMember.group().id(),
		);

		getAuthenticatedUser.execute.mockResolvedValue(groupMember.user());
		groupRepository.findById.mockResolvedValue(groupMember.group());
		groupMemberRepository.findBy.mockResolvedValue([groupMember]);
		groupRoleRepository.findById.mockResolvedValue(groupRole);

		const role = await service.execute(command);

		expect(role).toBeInstanceOf(GetGroupRoleDto);
	});
});
