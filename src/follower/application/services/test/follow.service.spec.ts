import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { FollowRepository, FollowRepositoryProvider } from "../../ports/out/follow.repository";
import { FollowService } from "../follow.service";
import { TestBed } from "@automock/jest";
import { UserRepository, UserRepositoryProvider } from "src/user/application/ports/out/user.repository";
import { mockUser } from "./follow-mock.helper";
import { FollowCommand } from "../../ports/in/commands/follow.command";
import { randomUUID } from "crypto";
import { UserNotFoundError } from "src/user/application/services/errors/user-not-found.error";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-access.error";

describe('FollowService', () => {
    let service: FollowService;
    let followRepository: jest.Mocked<FollowRepository>;
    let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;
    let userRepository: jest.Mocked<UserRepository>;

    beforeAll(() => {
        const { unit, unitRef } = TestBed.create(FollowService).compile();

        service = unit;
        followRepository = unitRef.get(FollowRepositoryProvider);
        getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
        userRepository = unitRef.get(UserRepositoryProvider);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should follow user', async () => {
        const user = mockUser();

        const command = new FollowCommand(
            randomUUID(),
            randomUUID()
        );

        userRepository.findById.mockResolvedValue(user);
        getAuthenticatedUser.execute.mockReturnValue(user.id());
        followRepository.findBy.mockResolvedValue([]);

        const response = await service.execute(command);

        expect(response.from_user_id).toBe(user.id());
    });

    it('should not follow user if user does not exist', async () => {
        const command = new FollowCommand(
            randomUUID(),
            randomUUID()
        );

        userRepository.findById.mockResolvedValue(null);
        getAuthenticatedUser.execute.mockReturnValue(null);

        await expect(service.execute(command)).rejects.toThrow(UserNotFoundError);
    });

    it('should not follow user if user is not authenticated', async () => {
        const command = new FollowCommand(
            randomUUID(),
            randomUUID()
        );

        userRepository.findById.mockResolvedValue(mockUser());
        getAuthenticatedUser.execute.mockReturnValue(randomUUID());

        await expect(service.execute(command)).rejects.toThrow(UnauthorizedAccessError);
    });
});