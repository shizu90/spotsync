import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { FollowRepository, FollowRepositoryProvider } from "../../ports/out/follow.repository";
import { TestBed } from "@automock/jest";
import { ListFollowRequestsService } from "../list-follow-requests.service";

describe('ListFollowRequestsService', () => {
    let service: ListFollowRequestsService;
    let followRepository: jest.Mocked<FollowRepository>;
    let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

    beforeAll(() => {
        const { unit, unitRef } = TestBed.create(ListFollowRequestsService).compile();

        service = unit;
        followRepository = unitRef.get(FollowRepositoryProvider);
        getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});