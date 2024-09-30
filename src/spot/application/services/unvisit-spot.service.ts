import { Inject, Injectable } from '@nestjs/common';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnvisitSpotCommand } from '../ports/in/commands/unvisit-spot.command';
import {
	SpotRepository,
	SpotRepositoryProvider,
} from '../ports/out/spot.repository';
import { SpotNotFoundError } from './errors/spot-not-found.error';

@Injectable()
export class UnvisitSpotService implements UnvisitSpotService {
	constructor(
		@Inject(SpotRepositoryProvider)
		protected spotRepository: SpotRepository,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
	) {}

	public async execute(command: UnvisitSpotCommand): Promise<void> {
		const authenticatedUser = await this.getAuthenticatedUser.execute(null);

		const spot = await this.spotRepository.findById(command.id);

		if (spot === null || spot === undefined || spot.isDeleted()) {
			throw new SpotNotFoundError();
		}

		const visitedSpot = (
			await this.spotRepository.findVisitedSpotBy({
				userId: authenticatedUser.id(),
				spotId: spot.id(),
			})
		).at(0);

		if (visitedSpot !== null && visitedSpot !== undefined) {
			await this.spotRepository.deleteVisitedSpot(visitedSpot.id());
		}
	}
}
