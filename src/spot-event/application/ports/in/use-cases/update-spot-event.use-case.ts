import { UseCase } from 'src/common/core/common.use-case';
import { UpdateSpotEventCommand } from '../commands/update-spot-event.command';

export const UpdateSpotEventUseCaseProvider = 'UpdateSpotEventUseCase';

export interface UpdateSpotEventUseCase
	extends UseCase<UpdateSpotEventCommand, Promise<void>> {}
