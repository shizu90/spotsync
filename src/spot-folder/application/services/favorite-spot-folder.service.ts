import { Inject, Injectable } from "@nestjs/common";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { FavoriteSpotFolderCommand } from "../ports/in/commands/favorite-spot-folder.command";
import { FavoriteSpotFolderUseCase } from "../ports/in/use-cases/favorite-spot-folder.use.case";
import { SpotFolderRepository, SpotFolderRepositoryProvider } from "../ports/out/spot-folder.repository";
import { SpotFolderNotFoundError } from "./errors/spot-folder-not-found.error";

@Injectable()
export class FavoriteSpotFolderService implements FavoriteSpotFolderUseCase 
{
    constructor(
        @Inject(SpotFolderRepositoryProvider)
        protected spotFolderRepository: SpotFolderRepository,
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
    ) 
    {}

    public async execute(command: FavoriteSpotFolderCommand): Promise<void> 
    {
        const authenticatedUser = await this.getAuthenticatedUser.execute(null);

        const spotFolder = await this.spotFolderRepository.findById(command.id);

        if (spotFolder === null || spotFolder === undefined) {
            throw new SpotFolderNotFoundError("Spot folder not found");
        }

        let favoritedSpotFolder = (await this.spotFolderRepository.findFavoritedSpotFolderBy({
            userId: authenticatedUser.id(),
            spotFolderId: spotFolder.id()
        })).at(0);

        if(favoritedSpotFolder !== null && favoritedSpotFolder !== undefined) {
            return;
        }

        favoritedSpotFolder = spotFolder.favorite(authenticatedUser);

        await this.spotFolderRepository.storeFavoritedSpotFolder(favoritedSpotFolder);
    }
}