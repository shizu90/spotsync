import { Inject, Injectable } from "@nestjs/common";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { UnfavoriteSpotFolderCommand } from "../ports/in/commands/unfavorite-spot-folder.command";
import { UnfavoriteSpotFolderUseCase } from "../ports/in/use-cases/unfavorite-spot-folder.use-case";
import { SpotFolderRepository, SpotFolderRepositoryProvider } from "../ports/out/spot-folder.repository";
import { SpotFolderNotFoundError } from "./errors/spot-folder-not-found.error";

@Injectable()
export class UnfavoriteSpotFolderService implements UnfavoriteSpotFolderUseCase {
    constructor(
        @Inject(SpotFolderRepositoryProvider)
        protected spotFolderRepository: SpotFolderRepository,
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
    ) 
    {}

    public async execute(command: UnfavoriteSpotFolderCommand): Promise<void> 
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

        if(favoritedSpotFolder === null || favoritedSpotFolder === undefined) {
            return;
        }

        await this.spotFolderRepository.removeFavoritedSpotFolder(favoritedSpotFolder.id());
    }
}