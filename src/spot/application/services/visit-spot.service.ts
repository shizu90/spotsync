import { Inject, Injectable } from '@nestjs/common';
import {
    GetAuthenticatedUserUseCase,
    GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { VisitSpotCommand } from '../ports/in/commands/visit-spot.command';
import { VisitSpotUseCase } from '../ports/in/use-cases/visit-spot.use.case';
import {
    SpotRepository,
    SpotRepositoryProvider,
} from '../ports/out/spot.repository';
import { SpotNotFoundError } from './errors/spot-not-found.error';

@Injectable()
export class VisitSpotService implements VisitSpotUseCase {
	constructor(
		@Inject(SpotRepositoryProvider)
		protected spotRepository: SpotRepository,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
	) {}

	public async execute(command: VisitSpotCommand): Promise<void> {
		const authenticatedUser = await this.getAuthenticatedUser.execute(null);

		const spot = await this.spotRepository.findById(command.id);

		if (spot === null || spot === undefined || spot.isDeleted()) {
			throw new SpotNotFoundError();
		}

		const visited = (
			await this.spotRepository.findVisitedSpotBy({
				spotId: spot.id(),
				userId: authenticatedUser.id(),
			})
		).at(0);

		if (visited !== null && visited !== undefined) {
			return;
		}

		const visitedSpot = spot.visit(authenticatedUser);

		await this.spotRepository.storeVisitedSpot(visitedSpot);
	}
}
