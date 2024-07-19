import { CreateUserService } from "../create-user.service";
import { TestBed } from "@automock/jest";
import { CreateUserCommand } from "../../ports/in/commands/create-user.command";
import { UserRepositoryImpl } from "src/user/infrastructure/adapters/out/user.db";
import { UserRepositoryProvider } from "../../ports/out/user.repository";
import { User } from "src/user/domain/user.model";
import { randomUUID } from "crypto";
import { UserCredentials } from "src/user/domain/user-credentials.model";
import { UserVisibilityConfig } from "src/user/domain/user-visibility-config.model";
import { UserVisibility } from "src/user/domain/user-visibility.enum";
import { UserAlreadyExistsError } from "../errors/user-already-exists.error";

const command = new CreateUserCommand(
    "Test123",
    "test123@test.test",
    "Password123"
);

const resolvedValue = () => {
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
        UserCredentials.create(id, command.name, command.email, command.password, command.phoneNumber, null, null),
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

describe('CreateUserService', () => {
    let service: CreateUserService;
    let repository: jest.Mocked<UserRepositoryImpl>

    beforeAll(async () => {
        const { unit, unitRef } = TestBed.create(CreateUserService).compile();

        service = unit;
        repository = unitRef.get(UserRepositoryProvider);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create a user', async () => {
        const id = randomUUID();

        repository.findByEmail.mockResolvedValue(null);
        repository.findByName.mockResolvedValue(null);
        repository.store.mockResolvedValue(resolvedValue());

        const user = await service.execute(command);

        expect(user.first_name).toBe('Test123');
    });

    it('should not create a user with the same email', async () => {
        repository.findByEmail.mockResolvedValue(resolvedValue());

        const user = await service.execute(command).catch(e => {
            expect(e.constructor).toBe(UserAlreadyExistsError);
        });
    });

    it('should not create a user with the same name', async () => {
        repository.findByName.mockResolvedValue(resolvedValue());

        const user = await service.execute(command).catch(e => {
            expect(e.constructor).toBe(UserAlreadyExistsError);
        });
    });
});