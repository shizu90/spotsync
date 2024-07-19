import { Test, TestingModule } from "@nestjs/testing";
import { CreateUserService } from "../create-user.service";
import { EncryptPasswordServiceProvider } from "../../ports/out/encrypt-password.service";
import { EncryptPasswordServiceImpl } from "src/user/infrastructure/adapters/out/encrypt-password";
import { CreateUserCommand } from "../../ports/in/commands/create-user.command";

describe('CreateUserService', () => {
    let service: CreateUserService;

    beforeAll(async () => {
        const fixture: TestingModule = await Test.createTestingModule({
            providers: [
                CreateUserService,
                {provide: EncryptPasswordServiceProvider, useClass: EncryptPasswordServiceImpl}
            ],
        }).compile();

        service = fixture.get<CreateUserService>(CreateUserService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create a user', async () => {
        const user = await service.execute(new CreateUserCommand(
            "Teste123",
            "test@test.test",
            "Senha@123"
        ));

        expect(user.first_name).toBe('Teste123');
    });
});