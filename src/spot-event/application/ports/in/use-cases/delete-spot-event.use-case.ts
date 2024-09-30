import { UseCase } from 'src/common/core/common.use-case';
import { DeleteSpotEventCommand } from '../commands/delete-spot-event.command';

export const DeleteSpotEventUseCaseProvider = 'DeleteSpotEventUseCase';
export interface DeleteSpotEventUseCase
	extends UseCase<DeleteSpotEventCommand, Promise<void>> {}
