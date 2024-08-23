import { Inject, Injectable } from "@nestjs/common";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-access.error";
import { UpdateSpotFolderCommand } from "../ports/in/commands/update-spot-folder.command";
import { UpdateSpotFolderUseCase } from "../ports/in/use-cases/update-spot-folder.use-case";
import { SpotFolderRepository, SpotFolderRepositoryProvider } from "../ports/out/spot-folder.repository";
import { SpotFolderNotFoundError } from "./errors/spot-folder-not-found.error";

@Injectable()
export class UpdateSpotFolderService implements UpdateSpotFolderUseCase 
{
    constructor(
        @Inject(SpotFolderRepositoryProvider)
        protected spotFolderRepository: SpotFolderRepository,
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
    ) 
    {}

    public async execute(command: UpdateSpotFolderCommand): Promise<void> 
    {
        const authenticatedUser = await this.getAuthenticatedUser.execute(null);

        const spotFolder = await this.spotFolderRepository.findById(command.id);

        if (spotFolder === null || spotFolder === undefined) {
            throw new SpotFolderNotFoundError("Spot folder not found");
        }

        if (spotFolder.creator().id() !== authenticatedUser.id()) {
            throw new UnauthorizedAccessError("Unauthorized access");
        }

        if (command.name !== null && command.name !== undefined) {
            spotFolder.changeName(command.name);
        }

        if (command.description !== null && command.description !== undefined) {
            spotFolder.changeDescription(command.description);
        }

        if (command.hexColor !== null && command.hexColor !== undefined) {
            spotFolder.changeHexColor(command.hexColor);
        }

        if (command.visibility !== null && command.visibility !== undefined) {
            spotFolder.changeVisibility(command.visibility);
        }

        await this.spotFolderRepository.update(spotFolder);
    }
}