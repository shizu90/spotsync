import { TestBed } from "@automock/jest";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-access.error";
import { UpdateUserCredentialsCommand } from "../../ports/in/commands/update-user-credentials.command";
import { UserRepository, UserRepositoryProvider } from "../../ports/out/user.repository";
import { UserAlreadyExistsError } from "../errors/user-already-exists.error";
import { UpdateUserCredentialsService } from "../update-user-credentials.service";
import { mockUser } from "./user-mock.helper";

describe("UpdateUserCredentialsService", () => {
    let service: UpdateUserCredentialsService;
    let userRepository: jest.Mocked<UserRepository>;
    let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

    beforeAll(() => {
        const { unit, unitRef } = TestBed.create(UpdateUserCredentialsService).compile();

        service = unit;
        userRepository = unitRef.get(UserRepositoryProvider);
        getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should update user credentials', async () => {
        const user = mockUser();

        const command = new UpdateUserCredentialsCommand(
            user.id(),
            'New Test Name',
            'newtest@test.test'
        );

        getAuthenticatedUser.execute.mockResolvedValue(user);
        userRepository.findByEmail.mockResolvedValue(null);
        userRepository.findByName.mockResolvedValue(null);

        await expect(service.execute(command)).resolves.not.toThrow();
        expect(user.credentials().name()).toBe(command.name);
        expect(user.credentials().email()).toBe(command.email);
    });

    it('should not update user credentials if user is not authorized', async () => {
        const user = mockUser();

        const command = new UpdateUserCredentialsCommand(
            user.id(),
            'New Test Name'
        );

        getAuthenticatedUser.execute.mockResolvedValue(mockUser());

        await expect(service.execute(command)).rejects.toThrow(UnauthorizedAccessError);
    });

    it('should not update user credentials if email is already in use', async () => {
        const user = mockUser();

        const command = new UpdateUserCredentialsCommand(
            user.id(),
            'New Test Name',
            'newtest@test.test'
        );

        getAuthenticatedUser.execute.mockResolvedValue(user);
        userRepository.findByEmail.mockResolvedValue(mockUser());
        
        await expect(service.execute(command)).rejects.toThrow(UserAlreadyExistsError);
    });

    it('should not update user credentials if name is already taken', async () => {
        const user = mockUser();

        const command = new UpdateUserCredentialsCommand(
            user.id(),
            'New Test Name',
            'newtest@test.test'
        );

        getAuthenticatedUser.execute.mockResolvedValue(user);
        userRepository.findByEmail.mockResolvedValue(null);
        userRepository.findByName.mockResolvedValue(mockUser());

        await expect(service.execute(command)).rejects.toThrow(UserAlreadyExistsError);
    });
});