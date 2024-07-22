import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { GroupMemberRepository, GroupMemberRepositoryProvider } from "../../ports/out/group-member.repository";
import { GroupRepository, GroupRepositoryProvider } from "../../ports/out/group.repository";
import { GetGroupService } from "../get-group.service";
import { TestBed } from "@automock/jest";
import { mockGroup } from "./group-mock.helper";
import { GetGroupCommand } from "../../ports/in/commands/get-group.command";
import { randomUUID } from "crypto";

describe("GetGroupService", () => {
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

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should get group', async () => {
        const group = mockGroup();

        const command = new GetGroupCommand(
            group.id(),
        );

        getAuthenticatedUser.execute.mockReturnValue(randomUUID());
        groupRepository.findById.mockResolvedValue(group);
        groupMemberRepository.findBy.mockResolvedValue([]);
        groupMemberRepository.findRequestBy.mockResolvedValue([]);

        const response = await service.execute(command);

        expect(response.id).toBe(group.id());
    });
});