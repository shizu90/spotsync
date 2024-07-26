import { TestBed } from "@automock/jest";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { GroupVisibility } from "src/group/domain/group-visibility.enum";
import { UpdateGroupVisibilityCommand } from "../../ports/in/commands/update-group-visibility.command";
import { GroupMemberRepository, GroupMemberRepositoryProvider } from "../../ports/out/group-member.repository";
import { GroupRepository, GroupRepositoryProvider } from "../../ports/out/group.repository";
import { UpdateGroupVisibilityService } from "../update-group-visibility.service";
import { mockGroupMember } from "./group-mock.helper";

describe("UpdateGroupVisibility", () => {
    let service: UpdateGroupVisibilityService;
    let groupRepository: jest.Mocked<GroupRepository>;
    let groupMemberRepository: jest.Mocked<GroupMemberRepository>;
    let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

    beforeAll(() => {
        const { unit, unitRef } = TestBed.create(UpdateGroupVisibilityService).compile();

        service = unit;
        groupRepository = unitRef.get(GroupRepositoryProvider);
        groupMemberRepository = unitRef.get(GroupMemberRepositoryProvider);
        getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should update group visibility', async () => {
        const groupMember = mockGroupMember(true, true, 'administrator');

        const command = new UpdateGroupVisibilityCommand(
            groupMember.group().id(),
            GroupVisibility.PRIVATE
        );

        getAuthenticatedUser.execute.mockResolvedValue(groupMember.user());
        groupRepository.findById.mockResolvedValue(groupMember.group());
        groupMemberRepository.findBy.mockResolvedValue([groupMember]);

        await expect(service.execute(command)).resolves.not.toThrow();
    });
});