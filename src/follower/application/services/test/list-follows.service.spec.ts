import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { FollowRepository, FollowRepositoryProvider } from "../../ports/out/follow.repository";
import { TestBed } from "@automock/jest";
import { ListFollowsService } from "../list-follows.service";

describe('ListFollowsService', () => {
    let service: ListFollowsService;
    let followRepository: jest.Mocked<FollowRepository>;
    let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

    beforeAll(() => {
        const { unit, unitRef } = TestBed.create(ListFollowsService).compile();

        service = unit;
        followRepository = unitRef.get(FollowRepositoryProvider);
        getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});