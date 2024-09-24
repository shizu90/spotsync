import { Inject, Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { FavoritableSubject } from "src/favorite/domain/favoritable-subject.enum";
import { Favorite } from "src/favorite/domain/favorite.model";
import { SpotEvent } from "src/spot-event/domain/spot-event.model";
import { SpotFolderRepository, SpotFolderRepositoryProvider } from "src/spot-folder/application/ports/out/spot-folder.repository";
import { SpotFolder } from "src/spot-folder/domain/spot-folder.model";
import { SpotRepository, SpotRepositoryProvider } from "src/spot/application/ports/out/spot.repository";
import { Spot } from "src/spot/domain/spot.model";
import { FavoriteCommand } from "../ports/in/commands/favorite.command";
import { FavoriteUseCase } from "../ports/in/use-cases/favorite.use-case";
import { FavoriteDto } from "../ports/out/dto/favorite.dto";
import { FavoriteRepository, FavoriteRepositoryProvider } from "../ports/out/favorite.repository";

@Injectable()
export class FavoriteService implements FavoriteUseCase {
    constructor(
        @Inject(FavoriteRepositoryProvider)
        protected favoriteRepository: FavoriteRepository,
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
        @Inject(SpotRepositoryProvider)
        protected spotRepository: SpotRepository,
        @Inject(SpotFolderRepositoryProvider)
        protected spotFolderRepository: SpotFolderRepository,
    ) {}

    public async execute(command: FavoriteCommand): Promise<FavoriteDto> {
        const authenticatedUser = await this.getAuthenticatedUser.execute(null);

        let favoritable: Spot | SpotFolder | SpotEvent = null;

        switch(command.subject) {
            case FavoritableSubject.SPOT:
                favoritable = await this.spotRepository.findById(command.subjectId);
                break;
            case FavoritableSubject.SPOT_FOLDER:
                favoritable = await this.spotFolderRepository.findById(command.subjectId);
                break;
            case FavoritableSubject.SPOT_EVENT:
                // favoritable = await this.spotEventRepository.findById(command.subjectId);
                break;
            default: break;
        }

        const favorite = Favorite.create(
            randomUUID(),
            authenticatedUser,
            command.subject,
            command.subjectId,
            favoritable
        );

        await this.favoriteRepository.store(favorite);

        return new FavoriteDto(
            favorite.id(),
            favorite.favoritableSubject(),
            favorite.favoritableId(),
            favorite.user().id(),
            favorite.createdAt().toISOString(),
        );
    }
}