import { TestBed } from "@automock/jest";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { Pagination } from "src/common/common.repository";
import { ListGroupRolesCommand } from "../../ports/in/commands/list-group-roles.command";
import { GetGroupRoleDto } from "../../ports/out/dto/get-group-role.dto";
import { GroupMemberRepository, GroupMemberRepositoryProvider } from "../../ports/out/group-member.repository";
import { GroupRoleRepository, GroupRoleRepositoryProvider } from "../../ports/out/group-role.repository";
import { GroupRepository, GroupRepositoryProvider } from "../../ports/out/group.repository";
import { ListGroupRolesService } from "../list-group-roles.service";
import { mockGroupMember, mockGroupRole } from "./group-mock.helper";

describe("ListGroupRolesService", () => {
    let service: ListGroupRolesService;
    let groupRepository: jest.Mocked<GroupRepository>;
    let groupRoleRepository: jest.Mocked<GroupRoleRepository>;
    let groupMemberRepository: jest.Mocked<GroupMemberRepository>;
    let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

    beforeAll(() => {
        const { unit, unitRef } = TestBed.create(ListGroupRolesService).compile();

        service = unit;
        groupRepository = unitRef.get(GroupRepositoryProvider);
        groupRoleRepository = unitRef.get(GroupRoleRepositoryProvider);
        groupMemberRepository = unitRef.get(GroupMemberRepositoryProvider);
        getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider); 
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should list group roles', async () => {
        const groupMember = mockGroupMember(true, true, 'administrator');
        
        const command = new ListGroupRolesCommand(
            groupMember.group().id()
        );

        getAuthenticatedUser.execute.mockResolvedValue(groupMember.user());
        groupRepository.findById.mockResolvedValue(groupMember.group());
        groupMemberRepository.findBy.mockResolvedValue([groupMember]);
        groupRoleRepository.paginate.mockResolvedValue(
            new Pagination(
                [mockGroupRole(), mockGroupRole()],
                2,
                0
            )
        );

        const roles = await service.execute(command);

        expect(roles).toBeInstanceOf(Pagination<GetGroupRoleDto>);
        expect(roles.items).toHaveLength(2);
        expect(roles.total).toBe(2);
        expect(roles.current_page).toBe(0);
        expect(roles.next_page).toBeFalsy();
    });
});