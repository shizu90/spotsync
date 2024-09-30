import { UseCase } from 'src/common/core/common.use-case';
import { CancelSpotEventCommand } from '../commands/cancel-spot-event.command';

export const CancelSpotEventUseCaseProvider = 'CancelSpotEventUseCase';

export interface CancelSpotEventUseCase
	extends UseCase<CancelSpotEventCommand, Promise<void>> {}
