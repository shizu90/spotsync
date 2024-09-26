import { Inject, Injectable } from "@nestjs/common";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-access.error";
import { SortItemsCommand } from "../ports/in/commands/sort-items.command";
import { SortItemsUseCase } from "../ports/in/use-cases/sort-items.use-case";
import { GetSpotFolderDto } from "../ports/out/dto/get-spot-folder.dto";
import { SpotFolderRepository, SpotFolderRepositoryProvider } from "../ports/out/spot-folder.repository";
import { SpotFolderNotFoundError } from "./errors/spot-folder-not-found.error";

@Injectable()
export class SortItemsService implements SortItemsUseCase {
    constructor(
        @Inject(SpotFolderRepositoryProvider)
        protected spotFolderRepository: SpotFolderRepository,
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthentiatedUser: GetAuthenticatedUserUseCase
    ) {}

    public async execute(command: SortItemsCommand): Promise<GetSpotFolderDto> {
        const authenticatedUser = await this.getAuthentiatedUser.execute(null);

        const spotFolder = await this.spotFolderRepository.findById(command.spotFolderId);

        if (spotFolder === null || spotFolder === undefined) {
            throw new SpotFolderNotFoundError();
        }

        if (spotFolder.creator().id() !== authenticatedUser.id()) {
            throw new UnauthorizedAccessError();
        }

        spotFolder.sortItems();

        await this.spotFolderRepository.update(spotFolder);

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