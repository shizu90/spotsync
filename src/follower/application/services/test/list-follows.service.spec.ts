import { TestBed } from "@automock/jest";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { Pagination } from "src/common/common.repository";
import { UserRepository, UserRepositoryProvider } from "src/user/application/ports/out/user.repository";
import { ListFollowsCommand } from "../../ports/in/commands/list-follows.command";
import { GetFollowDto } from "../../ports/out/dto/get-follow.dto";
import { FollowRepository, FollowRepositoryProvider } from "../../ports/out/follow.repository";
import { ListFollowsService } from "../list-follows.service";
import { mockFollow, mockUser } from "./follow-mock.helper";

describe("ListFollowsService", () => {
    let service: ListFollowsService;
    let followRepository: jest.Mocked<FollowRepository>;
    let userRepository: jest.Mocked<UserRepository>;
    let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

    beforeAll(() => {
        const { unit, unitRef } = TestBed.create(ListFollowsService).compile();

        service = unit;
        followRepository = unitRef.get(FollowRepositoryProvider);
        userRepository = unitRef.get(UserRepositoryProvider);
        getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should list follows', async () => {
        const user = mockUser();

        const command = new ListFollowsCommand(
            user.id()
        );

        getAuthenticatedUser.execute.mockResolvedValue(user);
        userRepository.findById.mockResolvedValue(user);
        followRepository.findBy.mockResolvedValue([]);
        followRepository.paginate.mockResolvedValue(
            new Pagination(
                [mockFollow(), mockFollow()],
                2,
                0
            )
        );

        const follows = await service.execute(command);

        expect(follows).toBeInstanceOf(Pagination<GetFollowDto>);
        expect(follows.total).toBe(2);
        expect(follows.items).toHaveLength(2);
        expect(follows.current_page).toBe(0);
        expect(follows.next_page).toBeFalsy();
    });
});