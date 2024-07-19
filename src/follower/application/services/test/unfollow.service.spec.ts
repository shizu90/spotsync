import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { FollowRepository, FollowRepositoryProvider } from "../../ports/out/follow.repository";
import { TestBed } from "@automock/jest";
import { UnfollowService } from "../unfollow.service";

describe('UnfollowService', () => {
    let service: UnfollowService;
    let followRepository: jest.Mocked<FollowRepository>;
    let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

    beforeAll(() => {
        const { unit, unitRef } = TestBed.create(UnfollowService).compile();

        service = unit;
        followRepository = unitRef.get(FollowRepositoryProvider);
        getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});