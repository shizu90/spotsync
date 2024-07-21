import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { FollowRepository, FollowRepositoryProvider } from "../../ports/out/follow.repository";
import { TestBed } from "@automock/jest";
import { RefuseFollowRequestService } from "../refuse-follow-request.service";
import { mockFollowRequest } from "./follow-mock.helper";
import { RefuseFollowRequestCommand } from "../../ports/in/commands/refuse-follow-request.command";
import { randomUUID } from "crypto";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-access.error";
import { FollowRequestNotFoundError } from "../errors/follow-request-not-found.error";

describe('RefuseFollowRequestService', () => {
    let service: RefuseFollowRequestService;
    let followRepository: jest.Mocked<FollowRepository>;
    let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

    beforeAll(() => {
        const { unit, unitRef } = TestBed.create(RefuseFollowRequestService).compile();

        service = unit;
        followRepository = unitRef.get(FollowRepositoryProvider);
        getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should refuse follow request', async () => {
        const followRequest = mockFollowRequest();

        const command = new RefuseFollowRequestCommand(
            followRequest.id()
        );

        followRepository.findRequestById.mockResolvedValue(followRequest);
        getAuthenticatedUser.execute.mockReturnValue(followRequest.to().id());

        await expect(service.execute(command)).resolves.not.toThrow();
    });

    it('should not refuse follow request if user is not authenticated', async () => {
        const followRequest = mockFollowRequest();

        const command = new RefuseFollowRequestCommand(
            followRequest.id()
        );

        followRepository.findRequestById.mockResolvedValue(followRequest);
        getAuthenticatedUser.execute.mockReturnValue(randomUUID());

        await expect(service.execute(command)).rejects.toThrow(UnauthorizedAccessError);
    });

    it('should not refuse follow request if follow request does not exist', async () => {
        const command = new RefuseFollowRequestCommand(
            randomUUID()
        );

        followRepository.findRequestById.mockResolvedValue(null);
        getAuthenticatedUser.execute.mockReturnValue(randomUUID());

        await expect(service.execute(command)).rejects.toThrow(FollowRequestNotFoundError);
    });
});