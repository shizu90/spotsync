import { UseCase } from 'src/common/core/common.use-case';
import { CreateSpotEventCommand } from '../commands/create-spot-event.command';

export const CreateSpotEventUseCaseProvider = 'CreateSpotEventUseCase';

export interface CreateSpotEventUseCase
	extends UseCase<CreateSpotEventCommand, Promise<void>> {}
