import { GroupMemberRepository, GroupMemberRepositoryProvider } from "src/group/application/ports/out/group-member.repository";
import { DeletePostService } from "../delete-post.service";
import { PostRepository, PostRepositoryProvider } from "../../ports/out/post.repository";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { TestBed } from "@automock/jest";
import { mockPost } from "./post-mock.helper";
import { DeletePostCommand } from "../../ports/in/commands/delete-post.command";
import { randomUUID } from "crypto";
import { PostNotFoundError } from "../errors/post-not-found.error";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-access.error";

describe("DeletePostService", () => {
    let service: DeletePostService;
    let groupMemberRepository: jest.Mocked<GroupMemberRepository>;
    let postRepository: jest.Mocked<PostRepository>;
    let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

    beforeAll(() => {
        const { unit, unitRef } = TestBed.create(DeletePostService).compile();

        service = unit;
        groupMemberRepository = unitRef.get(GroupMemberRepositoryProvider);
        postRepository = unitRef.get(PostRepositoryProvider);
        getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should delete post', async () => {
        const post = mockPost();

        const command = new DeletePostCommand(
            post.id()
        );

        getAuthenticatedUser.execute.mockReturnValue(post.creator().id());
        postRepository.findById.mockResolvedValue(post);

        await expect(service.execute(command)).resolves.not.toThrow();
    });

    it('should not delete post if post does not exist', async () => {
        const command = new DeletePostCommand(
            randomUUID()
        );

        getAuthenticatedUser.execute.mockReturnValue(randomUUID());
        postRepository.findById.mockResolvedValue(null);

        await expect(service.execute(command)).rejects.toThrow(PostNotFoundError);
    });

    it('should not delete post if user is not authenticated', async () => {
        const post = mockPost();

        const command = new DeletePostCommand(
            post.id()
        );

        getAuthenticatedUser.execute.mockReturnValue(randomUUID());
        postRepository.findById.mockResolvedValue(post);

        await expect(service.execute(command)).rejects.toThrow(UnauthorizedAccessError);
    });
});