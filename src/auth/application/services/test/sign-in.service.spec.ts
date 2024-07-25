import { TestBed } from "@automock/jest";
import { JwtService } from "@nestjs/jwt";
import { EncryptPasswordService, EncryptPasswordServiceProvider } from "src/user/application/ports/out/encrypt-password.service";
import { UserRepository, UserRepositoryProvider } from "src/user/application/ports/out/user.repository";
import { UserInvalidCredentialsError } from "src/user/application/services/errors/user-invalid-credentials.error";
import { UserNotFoundError } from "src/user/application/services/errors/user-not-found.error";
import { SignInCommand } from "../../ports/in/commands/sign-in.command";
import { SignInDto } from "../../ports/out/dto/sign-in.dto";
import { SignInService } from "../sign-in.service";
import { mockUser } from "./auth-mock.helper";

describe("SignInService", () => {
    let service: SignInService;
    let userRepository: jest.Mocked<UserRepository>;
    let encryptPasswordService: jest.Mocked<EncryptPasswordService>;
    let jwtService: jest.Mocked<JwtService>;

    beforeAll(() => {
        const { unit, unitRef } = TestBed.create(SignInService).compile();

        service = unit;
        userRepository = unitRef.get(UserRepositoryProvider);
        encryptPasswordService = unitRef.get(EncryptPasswordServiceProvider);
        jwtService = unitRef.get(JwtService);
    });

    it('should be defined', async () => {
        expect(service).toBeDefined();
    });

    it('should sign in user', async () => {
        const user = mockUser();

        const command = new SignInCommand(
            user.credentials().name(),
            null,
            user.credentials().password()
        );

        userRepository.findByName.mockResolvedValue(user);
        encryptPasswordService.equals.mockResolvedValue(true);
        jwtService.signAsync.mockResolvedValue('BearerToken');

        const signedIn = await service.execute(command);

        expect(signedIn).toBeInstanceOf(SignInDto);
        expect(signedIn.id).toEqual(user.id());
        expect(signedIn.bearer_token).toEqual('BearerToken');
    });

    it('should not sign in if wrong password', async () => {
        const user = mockUser();

        const command = new SignInCommand(
            user.credentials().name(),
            null,
            user.credentials().password()
        );

        userRepository.findByName.mockResolvedValue(user);
        encryptPasswordService.equals.mockResolvedValue(false);

        await expect(service.execute(command)).rejects.toThrow(UserInvalidCredentialsError);
    });

    it('should not sign in if user does not exist', async () => {
        const command = new SignInCommand(
            'New Test',
            null,
            'Password123'
        );

        userRepository.findByName.mockResolvedValue(null);

        await expect(service.execute(command)).rejects.toThrow(UserNotFoundError);
    });
});