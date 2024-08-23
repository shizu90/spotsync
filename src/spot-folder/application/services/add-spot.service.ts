import { Inject, Injectable } from "@nestjs/common";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-access.error";
import { SpotRepository, SpotRepositoryProvider } from "src/spot/application/ports/out/spot.repository";
import { SpotNotFoundError } from "src/spot/application/services/errors/spot-not-found.error";
import { AddSpotCommand } from "../ports/in/commands/add-spot.command";
import { AddSpotUseCase } from "../ports/in/use-cases/add-spot.use-case";
import { SpotFolderRepository, SpotFolderRepositoryProvider } from "../ports/out/spot-folder.repository";
import { SpotAlreadyAddedError } from "./errors/spot-already-added.error";
import { SpotFolderNotFoundError } from "./errors/spot-folder-not-found.error";

@Injectable()
export class AddSpotService implements AddSpotUseCase 
{
    constructor(
        @Inject(SpotRepositoryProvider)
        protected spotRepository: SpotRepository,
        @Inject(SpotFolderRepositoryProvider)
        protected spotFolderRepository: SpotFolderRepository,
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
    ) 
    {}

    public async execute(command: AddSpotCommand): Promise<void> 
    {
        const authenticatedUser = await this.getAuthenticatedUser.execute(null);

        const spotFolder = await this.spotFolderRepository.findById(command.id);

        if (spotFolder === null || spotFolder === undefined) {
            throw new SpotFolderNotFoundError(`Spot folder not found`);
        }

        if (spotFolder.creator().id() !== authenticatedUser.id()) {
            throw new UnauthorizedAccessError(`Unauthorized access`);
        }

        for (const spotId of command.spotIds) {
            const spot = await this.spotRepository.findById(spotId);

            if (spot === null || spot === undefined || spot.isDeleted()) {
                throw new SpotNotFoundError(`Spot not found`);
            }

            const spotAlreadyAdded = spotFolder.findItemBySpotId(spot.id());

            if (spotAlreadyAdded !== null && spotAlreadyAdded !== undefined) {
                throw new SpotAlreadyAddedError(`Spot already added`);
            }

            spotFolder.addItem(spot);
        }

        await this.spotFolderRepository.update(spotFolder);
    }
}