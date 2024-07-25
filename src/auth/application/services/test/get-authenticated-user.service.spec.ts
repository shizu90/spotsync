import { TestBed } from "@automock/jest";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { UserRepository, UserRepositoryProvider } from "src/user/application/ports/out/user.repository";
import { GetAuthenticatedUserService } from "../get-authenticated-user.service";
import { mockUser } from "./auth-mock.helper";

describe("GetAuthenticatedUserService", () => {
    let service: GetAuthenticatedUserService;
    let userRepository: jest.Mocked<UserRepository>;
    let request: jest.Mocked<Request>;

    beforeAll(() => {
        const { unit, unitRef } = TestBed.create(GetAuthenticatedUserService).compile();

        service = unit;
        userRepository = unitRef.get(UserRepositoryProvider);
        request = unitRef.get(REQUEST);
    });

    it('should be defined', async () => {
        expect(service).toBeDefined();
    });

    it('should return user', async () => {
        const user = mockUser();

        userRepository.findById.mockResolvedValue(user);

        const authenticatedUser = await service.execute(null);

        expect(authenticatedUser).toEqual(user);
    });
});