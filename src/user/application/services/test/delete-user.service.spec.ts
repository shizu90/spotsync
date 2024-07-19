import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { UserRepository, UserRepositoryProvider } from "../../ports/out/user.repository";
import { TestBed } from "@automock/jest";
import { DeleteUserService } from "../delete-user.service";
import { randomUUID } from "crypto";
import { User } from "src/user/domain/user.model";
import { UserCredentials } from "src/user/domain/user-credentials.model";
import { UserVisibilityConfig } from "src/user/domain/user-visibility-config.model";
import { UserVisibility } from "src/user/domain/user-visibility.enum";
import { DeleteUserCommand } from "../../ports/in/commands/delete-user.command";
import { UserNotFoundError } from "../errors/user-not-found.error";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-access.error";

const command = new DeleteUserCommand(
    randomUUID()
);

const mockUser = () => {
    const id = randomUUID();

    return User.create(
        id,
        "Teste123",
        null,
        null,
        null,
        null,
        null,
        null,
        UserCredentials.create(id, null, null, null, null, null, null),
        UserVisibilityConfig.create(
            id,
            UserVisibility.PUBLIC,
            UserVisibility.PUBLIC,
            UserVisibility.PUBLIC,
            UserVisibility.PUBLIC,
            UserVisibility.PUBLIC
        ),
        new Date(),
        new Date(),
        false
    );
};

describe('DeleteUserService', () => {
    let service: DeleteUserService;
    let userRepository: jest.Mocked<UserRepository>;
    let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

    beforeAll(async () => {
        const { unit, unitRef } = TestBed.create(DeleteUserService).compile();

        service = unit;
        userRepository = unitRef.get(UserRepositoryProvider);
        getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should delete a user', async () => {
        const user = mockUser();

        userRepository.findById.mockResolvedValue(user);
        getAuthenticatedUser.execute.mockReturnValue(user.id());

        const deleted = await service.execute(command);

        expect(deleted).toBeUndefined();
    });

    it('should not delete user if user is not found', () => {
        userRepository.findById.mockResolvedValue(null);
        getAuthenticatedUser.execute.mockReturnValue(null);

        service.execute(command).catch(e => {
            expect(e.constructor).toBe(UserNotFoundError);
        });
    });

    it('should not delete user if user is not authenticated', () => {
        userRepository.findById.mockResolvedValue(mockUser());
        getAuthenticatedUser.execute.mockReturnValue(randomUUID());

        service.execute(command).catch(e => {
            expect(e.constructor).toBe(UnauthorizedAccessError);
        });
    });
});