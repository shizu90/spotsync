import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { GroupMemberRepository, GroupMemberRepositoryProvider } from "../../ports/out/group-member.repository";
import { GroupRoleRepository, GroupRoleRepositoryProvider } from "../../ports/out/group-role.repository";
import { GroupRepository, GroupRepositoryProvider } from "../../ports/out/group.repository";
import { ListGroupRolesService } from "../list-group-roles.service";
import { TestBed } from "@automock/jest";
import { mockGroupMember, mockGroupRole } from "./group-mock.helper";
import { ListGroupRolesCommand } from "../../ports/in/commands/list-group-roles.command";
import { Pagination } from "src/common/common.repository";

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
        const authenticatedGroupMember = mockGroupMember();

        const command = new ListGroupRolesCommand(
            authenticatedGroupMember.group().id()
        );

        getAuthenticatedUser.execute.mockReturnValueOnce(authenticatedGroupMember.user().id());
        groupRepository.findById.mockResolvedValueOnce(authenticatedGroupMember.group());
        groupMemberRepository.findBy.mockResolvedValueOnce([authenticatedGroupMember]);
        groupRoleRepository.paginate.mockResolvedValue(
            new Pagination(
                [mockGroupRole(), mockGroupRole(), mockGroupRole()],
                3,
                0
            )
        );

        const response = await service.execute(command);

        expect(response.total).toBe(3);
        expect(response.current_page).toBe(0);
        expect(response.next_page).toBe(false);
    });
});