import { Inject, Injectable } from '@nestjs/common';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnfavoriteSpotCommand } from '../ports/in/commands/unfavorite-spot.command';
import { UnfavoriteSpotUseCase } from '../ports/in/use-cases/unfavorite-spot.use-case';
import {
	SpotRepository,
	SpotRepositoryProvider,
} from '../ports/out/spot.repository';
import { SpotNotFoundError } from './errors/spot-not-found.error';

@Injectable()
export class UnfavoriteSpotService implements UnfavoriteSpotUseCase {
	constructor(
		@Inject(SpotRepositoryProvider)
		protected spotRepository: SpotRepository,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
	) {}

	public async execute(command: UnfavoriteSpotCommand): Promise<void> {
		const authenticatedUser = await this.getAuthenticatedUser.execute(null);

		const spot = await this.spotRepository.findById(command.id);

		if (spot === null || spot === undefined || spot.isDeleted()) {
			throw new SpotNotFoundError(`Spot not found`);
		}

		const favoritedSpot = (
			await this.spotRepository.findFavoritedSpotBy({
				userId: authenticatedUser.id(),
				spotId: spot.id(),
			})
		).at(0);

		if (favoritedSpot !== null && favoritedSpot !== undefined) {
			await this.spotRepository.deleteFavoritedSpot(favoritedSpot.id());
		}
	}
}
