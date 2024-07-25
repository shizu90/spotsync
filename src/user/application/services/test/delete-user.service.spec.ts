import { TestBed } from "@automock/jest";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-access.error";
import { DeleteUserCommand } from "../../ports/in/commands/delete-user.command";
import { UserRepository, UserRepositoryProvider } from "../../ports/out/user.repository";
import { DeleteUserService } from "../delete-user.service";
import { mockUser } from "./user-mock.helper";

describe("DeleteUserService", () => {
    let service: DeleteUserService;
    let userRepository: jest.Mocked<UserRepository>;
    let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

    beforeAll(() => {
        const { unit, unitRef } = TestBed.create(DeleteUserService).compile();

        service = unit;
        userRepository = unitRef.get(UserRepositoryProvider);
        getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should delete an user', async () => {
        const user = mockUser();

        const command = new DeleteUserCommand(user.id());

        getAuthenticatedUser.execute.mockResolvedValue(user);

        await expect(service.execute(command)).resolves.not.toThrow();
        expect(user.isDeleted()).toBe(true);
    });

    it('should not delete an user if user is not authorized', async () => {
        const user = mockUser();

        const command = new DeleteUserCommand(user.id());

        getAuthenticatedUser.execute.mockResolvedValue(mockUser());

        await expect(service.execute(command)).rejects.toThrow(UnauthorizedAccessError);
    });
});