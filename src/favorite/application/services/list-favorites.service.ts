import { Inject, Injectable } from "@nestjs/common";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-access.error";
import { Pagination } from "src/common/core/common.repository";
import { FavoritableSubject } from "src/favorite/domain/favoritable-subject.enum";
import { FollowRepository, FollowRepositoryProvider } from "src/follower/application/ports/out/follow.repository";
import { FollowStatus } from "src/follower/domain/follow-status.enum";
import { UserRepository, UserRepositoryProvider } from "src/user/application/ports/out/user.repository";
import { UserVisibility } from "src/user/domain/user-visibility.enum";
import { ListFavoritesCommand } from "../ports/in/commands/list-favorites.command";
import { ListFavoritesUseCase } from "../ports/in/use-cases/list-favorites.use-case";
import { FavoriteDto } from "../ports/out/dto/favorite.dto";
import { FavoriteRepository, FavoriteRepositoryProvider } from "../ports/out/favorite.repository";

@Injectable()
export class ListFavoritesService implements ListFavoritesUseCase {
    constructor(
        @Inject(FavoriteRepositoryProvider)
        protected favoriteRepository: FavoriteRepository,
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
        @Inject(UserRepositoryProvider)
        protected userRepository: UserRepository,
        @Inject(FollowRepositoryProvider)
        protected followRepository: FollowRepository,
    ) {}

    public async execute(command: ListFavoritesCommand): Promise<Pagination<FavoriteDto> | Array<FavoriteDto>> {
        const authenticatedUser = await this.getAuthenticatedUser.execute(null);

        const favoritedById = command.userId ?? authenticatedUser.id();

        if (favoritedById !== authenticatedUser.id()) {
            let visibility = UserVisibility.PUBLIC;

            switch(command.subject) {
                case FavoritableSubject.SPOT:
                    visibility = authenticatedUser.visibilitySettings().favoriteSpots();
                    break;
                case FavoritableSubject.SPOT_FOLDER:
                    visibility = authenticatedUser.visibilitySettings().favoriteSpotFolders();
                    break;
                case FavoritableSubject.SPOT_EVENT:
                    visibility = authenticatedUser.visibilitySettings().favoriteSpotEvents();
                    break;
                default: break;
            }

            if (visibility == UserVisibility.PRIVATE) {
                throw new UnauthorizedAccessError();
            }

            if (visibility == UserVisibility.FOLLOWERS) {
                const isFollowing = (await this.followRepository.findBy({
                    fromUserId: authenticatedUser.id(),
                    toUserId: favoritedById,
                    status: FollowStatus.ACTIVE
                })).length > 0;

                if (!isFollowing) {
                    throw new UnauthorizedAccessError();
                }
            }
        }

        const pagination = await this.favoriteRepository.paginate({
            filters: {
                subject: command.subject,
                subjectId: command.subjectId,
                userId: favoritedById,
            },
            page: command.page,
            limit: command.limit,
            paginate: command.paginate,
            sort: command.sort,
            sortDirection: command.sortDirection,
        });

        console.log(pagination.items)

        const items = pagination.items.map(i => FavoriteDto.fromModel(i));

        if (command.paginate) {
            return new Pagination(items, pagination.total, pagination.current_page, pagination.limit);
        } else {
            return items;
        }
    }
}