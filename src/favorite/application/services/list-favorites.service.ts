import { Inject, Injectable } from "@nestjs/common";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-access.error";
import { Pagination } from "src/common/core/common.repository";
import { FavoritableSubject } from "src/favorite/domain/favoritable-subject.enum";
import { FollowRepository, FollowRepositoryProvider } from "src/follower/application/ports/out/follow.repository";
import { SpotFolder } from "src/spot-folder/domain/spot-folder.model";
import { Spot } from "src/spot/domain/spot.model";
import { UserRepository, UserRepositoryProvider } from "src/user/application/ports/out/user.repository";
import { UserVisibility } from "src/user/domain/user-visibility.enum";
import { ListFavoritesCommand } from "../ports/in/commands/list-favorites.command";
import { ListFavoritesUseCase } from "../ports/in/use-cases/list-favorites.use-case";
import { GetFavoriteDto } from "../ports/out/dto/get-favorite.dto";
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

    public async execute(command: ListFavoritesCommand): Promise<Pagination<GetFavoriteDto> | Array<GetFavoriteDto>> {
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
                })).at(0);

                if (isFollowing === null || isFollowing === undefined) {
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

        const items = pagination.items.map(i => {
            const favoritable = i.favoritable();

            return new GetFavoriteDto(
                i.id(),
                i.createdAt().toISOString(),
                favoritable instanceof Spot ? 
                    {
                        id: favoritable.id(),
                        name: favoritable.name(),
                        description: favoritable.description(),
                        photos: favoritable.photos().map(p => {return { id: p.id(), file_path: p.filePath() }}),
                        address: {
                            area: favoritable.address().area(),
                            sub_area: favoritable.address().subArea(),
                            locality: favoritable.address().locality(),
                            country_code: favoritable.address().countryCode(),
                            latitude: favoritable.address().latitude(),
                            longitude: favoritable.address().longitude(),
                        },
                        creator: {
                            id: favoritable.creator().id(),
                            display_name: favoritable.creator().profile().displayName(),
                            profile_picture: favoritable.creator().profile().profilePicture(),
                            credentials: {
                                name: favoritable.creator().credentials().name(),
                            }
                        },
                        type: favoritable.type(),
                    }
                : undefined,
                favoritable instanceof SpotFolder ?
                    {
                        id: favoritable.id(),
                        name: favoritable.name(),
                        description: favoritable.description(),
                        items: favoritable.items().map(i => {
                            return {
                                spot: {
                                    id: i.spot().id(),
                                    name: i.spot().name(),
                                    description: i.spot().description(),
                                    photos: i.spot().photos().map(p => {return { id: p.id(), file_path: p.filePath() }}),
                                    address: {
                                        area: i.spot().address().area(),
                                        sub_area: i.spot().address().subArea(),
                                        locality: i.spot().address().locality(),
                                        country_code: i.spot().address().countryCode(),
                                        latitude: i.spot().address().latitude(),
                                        longitude: i.spot().address().longitude(),
                                    },
                                    creator: {
                                        id: i.spot().creator().id(),
                                        display_name: i.spot().creator().profile().displayName(),
                                        profile_picture: i.spot().creator().profile().profilePicture(),
                                        credentials: {
                                            name: i.spot().creator().credentials().name(),
                                        }
                                    },
                                    type: i.spot().type(),
                                },
                                added_at: i.addedAt(),
                                order_number: i.orderNumber(),
                            }
                        }),
                        created_at: favoritable.createdAt().toISOString(),
                        updated_at: favoritable.updatedAt().toISOString(),
                        creator: {
                            id: favoritable.creator().id(),
                            display_name: favoritable.creator().profile().displayName(),
                            profile_picture: favoritable.creator().profile().profilePicture(),
                            credentials: {
                                name: favoritable.creator().credentials().name(),
                            }
                        }
                    }
                : undefined,
                undefined,
            );
        });

        if (command.paginate) {
            return new Pagination(items, pagination.total, pagination.current_page, pagination.limit);
        } else {
            return items;
        }
    }
}