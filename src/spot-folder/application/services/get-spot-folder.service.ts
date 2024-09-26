import { Inject, Injectable } from "@nestjs/common";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { FollowRepository, FollowRepositoryProvider } from "src/follower/application/ports/out/follow.repository";
import { SpotFolderVisibility } from "src/spot-folder/domain/spot-folder-visibility.enum";
import { GetSpotFolderCommand } from "../ports/in/commands/get-spot-folder.command";
import { GetSpotFolderUseCase } from "../ports/in/use-cases/get-spot-folder.use-case";
import { GetSpotFolderDto } from "../ports/out/dto/get-spot-folder.dto";
import { SpotFolderRepository, SpotFolderRepositoryProvider } from "../ports/out/spot-folder.repository";
import { SpotFolderNotFoundError } from "./errors/spot-folder-not-found.error";

@Injectable()
export class GetSpotFolderService implements GetSpotFolderUseCase {
    constructor(
        @Inject(SpotFolderRepositoryProvider)
        protected spotFolderRepository: SpotFolderRepository,
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
        @Inject(FollowRepositoryProvider)
        protected followRepository: FollowRepository,
    ) {}

    public async execute(command: GetSpotFolderCommand): Promise<GetSpotFolderDto> {
        const authenticatedUser = await this.getAuthenticatedUser.execute(null);

        const spotFolder = await this.spotFolderRepository.findById(command.id);

        if (spotFolder === null || spotFolder === undefined) {
            throw new SpotFolderNotFoundError();
        }

        if (spotFolder.visibility() === SpotFolderVisibility.PRIVATE && spotFolder.creator().id() !== authenticatedUser.id()) {
            throw new SpotFolderNotFoundError();
        }

        if (spotFolder.visibility() === SpotFolderVisibility.FOLLOWERS) {
            const isFollowing = (await this.followRepository.findBy({
                fromUserId: authenticatedUser.id(),
                toUserId: spotFolder.creator().id(),
            })).at(0);

            if ((isFollowing === null || isFollowing === undefined) && spotFolder.creator().id() !== authenticatedUser.id()) {
                throw new SpotFolderNotFoundError();
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
        );
    }
}