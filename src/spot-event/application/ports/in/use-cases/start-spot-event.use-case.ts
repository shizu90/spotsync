import { UseCase } from 'src/common/core/common.use-case';
import { StartSpotEventCommand } from '../commands/start-spot-event.command';

export const StartSpotEventUseCaseProvider = 'StartSpotEventUseCase';

export interface StartSpotEventUseCase
	extends UseCase<StartSpotEventCommand, Promise<void>> {}
