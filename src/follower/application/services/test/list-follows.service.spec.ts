import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { FollowRepository, FollowRepositoryProvider } from "../../ports/out/follow.repository";
import { TestBed } from "@automock/jest";
import { ListFollowsService } from "../list-follows.service";
import { ListFollowsCommand } from "../../ports/in/commands/list-follows.command";
import { randomUUID } from "crypto";
import { mockFollow, mockUser } from "./follow-mock.helper";
import { UserRepository, UserRepositoryProvider } from "src/user/application/ports/out/user.repository";
import { Pagination } from "src/common/common.repository";

describe('ListFollowsService', () => {
    let service: ListFollowsService;
    let followRepository: jest.Mocked<FollowRepository>;
    let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;
    let userRepository: jest.Mocked<UserRepository>;

    beforeAll(() => {
        const { unit, unitRef } = TestBed.create(ListFollowsService).compile();

        service = unit;
        followRepository = unitRef.get(FollowRepositoryProvider);
        getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
        userRepository = unitRef.get(UserRepositoryProvider);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should list follows', async () => {
        const user = mockUser();

        const command = new ListFollowsCommand(
            randomUUID()
        );

        getAuthenticatedUser.execute.mockReturnValue(user.id());
        userRepository.findById.mockResolvedValue(user);
        followRepository.findBy.mockResolvedValue([]);
        followRepository.paginate.mockResolvedValue(new Pagination([mockFollow(), mockFollow(), mockFollow()], 3, 0));

        const response = await service.execute(command);

        expect(response.total).toBe(3);
        expect(response.current_page).toBe(0);
        expect(response.next_page).toBe(false);
    });
});