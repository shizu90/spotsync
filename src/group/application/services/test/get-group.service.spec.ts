import { TestBed } from "@automock/jest";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { GetGroupCommand } from "../../ports/in/commands/get-group.command";
import { GetGroupDto } from "../../ports/out/dto/get-group.dto";
import { GroupMemberRepository, GroupMemberRepositoryProvider } from "../../ports/out/group-member.repository";
import { GroupRepository, GroupRepositoryProvider } from "../../ports/out/group.repository";
import { GetGroupService } from "../get-group.service";
import { mockGroup, mockUser } from "./group-mock.helper";

describe('GetGroupService', () => {
    let service: GetGroupService;
    let groupRepository: jest.Mocked<GroupRepository>;
    let groupMemberRepository: jest.Mocked<GroupMemberRepository>;
    let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

    beforeAll(() => {
        const { unit, unitRef } = TestBed.create(GetGroupService).compile();

        service = unit;
        groupRepository = unitRef.get(GroupRepositoryProvider);
        groupMemberRepository = unitRef.get(GroupMemberRepositoryProvider);
        getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
    });

    it('should be defined', async () => {
        expect(service).toBeDefined();
    });

    it('should get group', async () => {
        const group = mockGroup();

        const command = new GetGroupCommand(group.id());

        getAuthenticatedUser.execute.mockResolvedValue(mockUser());
        groupRepository.findById.mockResolvedValue(group);
        groupMemberRepository.findBy.mockResolvedValue([]);
        groupMemberRepository.findRequestBy.mockResolvedValue([]);

        const g = await service.execute(command);

        expect(g).toBeInstanceOf(GetGroupDto);
    });
});