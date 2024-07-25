import { TestBed } from "@automock/jest";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-access.error";
import { UserRepository, UserRepositoryProvider } from "src/user/application/ports/out/user.repository";
import { UnfollowCommand } from "../../ports/in/commands/unfollow.command";
import { FollowRepository, FollowRepositoryProvider } from "../../ports/out/follow.repository";
import { NotFollowingError } from "../errors/not-following.error";
import { UnfollowService } from "../unfollow.service";
import { mockFollow, mockUser } from "./follow-mock.helper";

describe("UnfollowService", () => {
    let service: UnfollowService;
    let followRepository: jest.Mocked<FollowRepository>;
    let userRepository: jest.Mocked<UserRepository>;
    let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

    beforeAll(() => {
        const { unit, unitRef } = TestBed.create(UnfollowService).compile();

        service = unit;
        followRepository = unitRef.get(FollowRepositoryProvider);
        userRepository = unitRef.get(UserRepositoryProvider);
        getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should unfollow user', async () => {
        const fromUser = mockUser();
        const toUser = mockUser();

        const command = new UnfollowCommand(
            fromUser.id(),
            toUser.id()
        );

        getAuthenticatedUser.execute.mockResolvedValue(fromUser);
        userRepository.findById.mockResolvedValue(toUser);
        followRepository.findBy.mockResolvedValue([mockFollow()]);

        await expect(service.execute(command)).resolves.not.toThrow();
    });

    it('should not unfollow user if user is not authorized', async () => {
        const fromUser = mockUser();
        const toUser = mockUser();

        const command = new UnfollowCommand(
            fromUser.id(),
            toUser.id()
        );

        getAuthenticatedUser.execute.mockResolvedValue(mockUser());
        userRepository.findById.mockResolvedValue(toUser);
        followRepository.findBy.mockResolvedValue([mockFollow()]);

        await expect(service.execute(command)).rejects.toThrow(UnauthorizedAccessError);
    });

    it('should not unfollow user if not following', async () => {
        const fromUser = mockUser();
        const toUser = mockUser();

        const command = new UnfollowCommand(
            fromUser.id(),
            toUser.id()
        );

        getAuthenticatedUser.execute.mockResolvedValue(fromUser);
        userRepository.findById.mockResolvedValue(toUser);
        followRepository.findBy.mockResolvedValue([]);

        await expect(service.execute(command)).rejects.toThrow(NotFollowingError);
    });
});