import { Inject, Injectable } from "@nestjs/common";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { FavoriteSpotCommand } from "../ports/in/commands/favorite-spot.command";
import { FavoriteSpotUseCase } from "../ports/in/use-cases/favorite-spot.use-case";
import { SpotRepository, SpotRepositoryProvider } from "../ports/out/spot.repository";
import { SpotNotFoundError } from "./errors/spot-not-found.error";

@Injectable()
export class FavoriteSpotService implements FavoriteSpotUseCase 
{
    constructor(
        @Inject(SpotRepositoryProvider)
        protected spotRepository: SpotRepository,
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase
    ) 
    {}

    public async execute(command: FavoriteSpotCommand): Promise<void> 
    {
        const authenticatedUser = await this.getAuthenticatedUser.execute(null);

        const spot = await this.spotRepository.findById(command.id);

        if (spot === null || spot === undefined || spot.isDeleted()) {
            throw new SpotNotFoundError(`Spot not found`);
        }

        const favorited = (await this.spotRepository.findFavoritedSpotBy({
            spotId: spot.id(),
            userId: authenticatedUser.id()
        })).at(0);

        if (favorited !== null && favorited !== undefined) {
            return;
        }

        const favoritedSpot = spot.favorite(authenticatedUser);

        await this.spotRepository.createFavoritedSpot(favoritedSpot);
    }
}