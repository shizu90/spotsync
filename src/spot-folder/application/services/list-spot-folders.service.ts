import { Inject, Injectable } from "@nestjs/common";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { Pagination } from "src/common/core/common.repository";
import { FollowRepository, FollowRepositoryProvider } from "src/follower/application/ports/out/follow.repository";
import { SpotFolderVisibility } from "src/spot-folder/domain/spot-folder-visibility.enum";
import { ListSpotFoldersCommand } from "../ports/in/commands/list-spot-folders.command";
import { ListSpotFoldersUseCase } from "../ports/in/use-cases/list-spot-folders.use-case";
import { GetSpotFolderDto } from "../ports/out/dto/get-spot-folder.dto";
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
    ) 
    {}

    public async execute(command: ListSpotFoldersCommand): Promise<Pagination<GetSpotFolderDto> | Array<GetSpotFolderDto>> {
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

            return new GetSpotFolderDto(
                spotFolder.id(),
                spotFolder.name(),
                spotFolder.description(),
                spotFolder.hexColor(),
                spotFolder.visibility(),
                spotFolder.items().map(i => {
                    return {
                        added_at: i.addedAt(),
                        order_number: i.orderNumber(),
                        spot: {
                            id: i.spot().id(),
                            name: i.spot().name(),
                            description: i.spot().description(),
                            type: i.spot().type(),
                            photos: i.spot().photos().map(p => {
                                return {
                                    id: p.id(),
                                    file_path: p.filePath(),
                                }
                            }),
                            creator: {
                                id: i.spot().creator().id(),
                                display_name: i.spot().creator().profile().displayName(),
                                profile_picture: i.spot().creator().profile().profilePicture(),
                                credentials: {
                                    name: i.spot().creator().credentials().name(),
                                }
                            },
                            address: {
                                area: i.spot().address().area(),
                                country_code: i.spot().address().countryCode(),
                                latitude: i.spot().address().latitude(),
                                longitude: i.spot().address().longitude(),
                                locality: i.spot().address().locality(),
                                sub_area: i.spot().address().subArea(),
                            }
                        }
                    }
                }),
                {
                    id: spotFolder.creator().id(),
                    display_name: spotFolder.creator().profile().displayName(),
                    profile_picture: spotFolder.creator().profile().profilePicture(),
                    credentials: {
                        name: spotFolder.creator().credentials().name(),
                    }
                },
                spotFolder.createdAt(),
                spotFolder.updatedAt(),
            )
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