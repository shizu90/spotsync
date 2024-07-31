import { TestBed } from "@automock/jest";
import { randomUUID } from "crypto";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { Pagination } from "src/common/common.repository";
import { LikableSubject } from "src/like/domain/likable-subject.enum";
import { ListLikesCommand } from "../../ports/in/commands/list-likes.command";
import { GetLikeDto } from "../../ports/out/dto/get-like.dto";
import { LikeRepository, LikeRepositoryProvider } from "../../ports/out/like.repository";
import { ListLikesService } from "../list-likes.service";
import { mockLike, mockUser } from "./like-mock.helper";

describe("ListLikesService", () => {
    let service: ListLikesService;
    let likeRepository: jest.Mocked<LikeRepository>;
    let getAuthenticatedUser: jest.Mocked<GetAuthenticatedUserUseCase>;

    beforeAll(() => {
        const { unit, unitRef } = TestBed.create(ListLikesService).compile();

        service = unit;
        likeRepository = unitRef.get(LikeRepositoryProvider);
        getAuthenticatedUser = unitRef.get(GetAuthenticatedUserUseCaseProvider);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    it('should list likes', async () => {
        const user = mockUser();

        const command = new ListLikesCommand(LikableSubject.POST, randomUUID());

        getAuthenticatedUser.execute.mockResolvedValue(user);
        likeRepository.paginate.mockResolvedValue(
            new Pagination([mockLike(), mockLike(), mockLike()], 3, 0)
        );

        const likes = await service.execute(command);

        expect(likes).toBeInstanceOf(Pagination<GetLikeDto>);
        expect(likes.items).toHaveLength(3);
        expect(likes.current_page).toBe(0);
        expect(likes.next_page).toBeFalsy();
        expect(likes.total).toBe(3);
    });
});