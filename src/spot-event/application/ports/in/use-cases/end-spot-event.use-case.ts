import { UseCase } from 'src/common/core/common.use-case';
import { EndSpotEventCommand } from '../commands/end-spot-event.command';

export const EndSpotEventUseCaseProvider = 'EndSpotEventUseCase';

export interface EndSpotEventUseCase
	extends UseCase<EndSpotEventCommand, Promise<void>> {}
