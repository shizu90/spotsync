import { UseCase } from 'src/common/core/common.use-case';
import { DeleteSpotCommand } from '../commands/delete-spot.command';

export const DeleteSpotUseCaseProvider = 'DeleteSpotUseCase';

export interface DeleteSpotUseCase
	extends UseCase<DeleteSpotCommand, Promise<void>> {}
