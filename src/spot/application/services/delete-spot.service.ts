import { Inject, Injectable } from '@nestjs/common';
import {
    GetAuthenticatedUserUseCase,
    GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { DeleteSpotCommand } from '../ports/in/commands/delete-spot.command';
import { DeleteSpotUseCase } from '../ports/in/use-cases/delete-spot.use-case';
import {
    SpotRepository,
    SpotRepositoryProvider,
} from '../ports/out/spot.repository';
import { SpotNotFoundError } from './errors/spot-not-found.error';

@Injectable()
export class DeleteSpotService implements DeleteSpotUseCase {
	constructor(
		@Inject(SpotRepositoryProvider)
		protected spotRepository: SpotRepository,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
	) {}

	public async execute(command: DeleteSpotCommand): Promise<void> {
		const authenticatedUser = await this.getAuthenticatedUser.execute(null);

		const spot = await this.spotRepository.findById(command.id);

		if (spot.creator().id() !== authenticatedUser.id()) {
			throw new UnauthorizedAccessError();
		}

		if (spot.isDeleted()) {
			throw new SpotNotFoundError();
		}

		spot.delete();

		await this.spotRepository.update(spot);
	}
}
