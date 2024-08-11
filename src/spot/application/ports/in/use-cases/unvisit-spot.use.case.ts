import { UseCase } from 'src/common/core/common.use-case';
import { UnvisitSpotCommand } from '../commands/unvisit-spot.command';

export const UnvisitSpotUseCaseProvider = 'UnvisitSpotUseCase';

export interface UnvisitSpotUseCase
	extends UseCase<UnvisitSpotCommand, Promise<void>> {}
