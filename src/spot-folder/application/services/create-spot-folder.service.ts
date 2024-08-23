import { Inject, Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { SpotFolderVisibility } from "src/spot-folder/domain/spot-folder-visibility.enum";
import { SpotFolder } from "src/spot-folder/domain/spot-folder.model";
import { UserVisibility } from "src/user/domain/user-visibility.enum";
import { CreateSpotFolderCommand } from "../ports/in/commands/create-spot-folder.command";
import { CreateSpotFolderUseCase } from "../ports/in/use-cases/create-spot-folder.use-case";
import { CreateSpotFolderDto } from "../ports/out/dto/create-spot-folder.dto";
import { SpotFolderRepository, SpotFolderRepositoryProvider } from "../ports/out/spot-folder.repository";

@Injectable()
export class CreateSpotFolderService implements CreateSpotFolderUseCase 
{
    constructor(
        @Inject(SpotFolderRepositoryProvider)
        protected spotFolderRepository: SpotFolderRepository,
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
    ) 
    {}

    public async execute(command: CreateSpotFolderCommand): Promise<CreateSpotFolderDto> 
    {
        const authenticatedUser = await this.getAuthenticatedUser.execute(null);

        let visibility = command.visibility;

        if (visibility !== null && visibility !== undefined) {
            switch(authenticatedUser.visibilityConfiguration().spotFolders()) {
                case UserVisibility.PRIVATE:
                    visibility = SpotFolderVisibility.PRIVATE;
                    break;
                case UserVisibility.FOLLOWERS:
                    visibility = SpotFolderVisibility.FOLLOWERS;
                    break;
                case UserVisibility.PUBLIC:
                default:
                    visibility = SpotFolderVisibility.PUBLIC;
                    break;
            }
        }

        const spotFolder = SpotFolder.create(
            randomUUID(),
            command.name,
            command.description ?? null,
            command.hexColor ?? "#000000",
            visibility,
            authenticatedUser,
            [],
        );


        await this.spotFolderRepository.store(spotFolder);

        return new CreateSpotFolderDto(
            spotFolder.id(),
            spotFolder.name(),
            spotFolder.description(),
            spotFolder.hexColor(),
            spotFolder.visibility(),
            spotFolder.items().map(i => {return {spot_id: i.spot().id()};}),
            spotFolder.creator().id(),
            spotFolder.createdAt(),
            spotFolder.updatedAt(),
        );
    }
}