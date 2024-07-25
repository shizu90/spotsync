import { TestBed } from "@automock/jest";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "../../ports/in/use-cases/get-authenticated-user.use-case";
import { SignOutService } from "../sign-out.service";
import { mockUser } from "./auth-mock.helper";

describe("SignOutService", () => {
    let service: SignOutService;
    let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

    beforeAll(() => {
        const { unit, unitRef } = TestBed.create(SignOutService).compile();

        service = unit;
        getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
    });

    it('should be defined', async () => {
        expect(service).toBeDefined();
    });

    it('should sign out', async () => {
        const user = mockUser();

        getAuthenticatedUser.execute.mockResolvedValue(user);

        await expect(service.execute(null)).resolves.not.toThrow();
    });
});