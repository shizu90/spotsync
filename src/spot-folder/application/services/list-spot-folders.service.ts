import { Inject, Injectable } from "@nestjs/common";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { Pagination } from "src/common/core/common.repository";
import { FavoriteRepository, FavoriteRepositoryProvider } from "src/favorite/application/ports/out/favorite.repository";
import { FavoritableSubject } from "src/favorite/domain/favoritable-subject.enum";
import { FollowRepository, FollowRepositoryProvider } from "src/follower/application/ports/out/follow.repository";
import { SpotFolderVisibility } from "src/spot-folder/domain/spot-folder-visibility.enum";
import { ListSpotFoldersCommand } from "../ports/in/commands/list-spot-folders.command";
import { ListSpotFoldersUseCase } from "../ports/in/use-cases/list-spot-folders.use-case";
import { SpotFolderDto } from "../ports/out/dto/spot-folder.dto";
import { SpotFolderRepository, SpotFolderRepositoryProvider } from "../ports/out/spot-folder.repository";

@Injectable()
export class ListSpotFoldersService implements ListSpotFoldersUseCase {
    constructor(
        @Inject(SpotFolderRepositoryProvider)
        protected spotFolderRepository: SpotFolderRepository,
        @Inject(FollowRepositoryProvider)
        protected followRepository: FollowRepository,
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUserUseCase: GetAuthenticatedUserUseCase,
        @Inject(FavoriteRepositoryProvider)
        protected favoriteRepository: FavoriteRepository,
    ) 
    {}

    public async execute(command: ListSpotFoldersCommand): Promise<Pagination<SpotFolderDto> | Array<SpotFolderDto>> {
        const authenticatedUser = await this.getAuthenticatedUserUseCase.execute(null);

        const pagination = await this.spotFolderRepository.paginate({
            filters: {
                userId: command.creatorId,
                name: command.name,
            },
            limit: command.limit,
            page: command.page,
            sort: command.sort,
            sortDirection: command.sortDirection,
            paginate: command.paginate,
        });

        const spotFolders = await Promise.all(pagination.items.map(async spotFolder => {
            if (spotFolder.creator().id() !== authenticatedUser.id()) {
                if (spotFolder.visibility() === SpotFolderVisibility.PRIVATE) {
                    return null;
                }

                if (spotFolder.visibility() === SpotFolderVisibility.FOLLOWERS) {
                    const isFollowing = (await this.followRepository.findBy({
                        fromUserId: authenticatedUser.id(),
                        toUserId: spotFolder.creator().id(),
                    })).at(0);

                    if ((isFollowing === null || isFollowing === undefined) && spotFolder.creator().id() !== authenticatedUser.id()) return null;
                }
            }

            const totalFavorites = await this.favoriteRepository.countBy({
                subject: FavoritableSubject.SPOT_FOLDER,
                subjectId: spotFolder.id(),
            });
    
            const favorited = (await this.favoriteRepository.findBy({
                subject: FavoritableSubject.SPOT_FOLDER,
                subjectId: spotFolder.id(),
                userId: authenticatedUser.id(),
            })).at(0);

            return SpotFolderDto.fromModel(spotFolder)
                .setFavoritedAt(favorited?.createdAt())
                .setTotalFavorites(totalFavorites);
        }));

        if (command.paginate) {
            return new Pagination(
                spotFolders,
                pagination.total,
                pagination.current_page,
                pagination.limit
            );
        } else {
            return spotFolders;
        }
    }
}