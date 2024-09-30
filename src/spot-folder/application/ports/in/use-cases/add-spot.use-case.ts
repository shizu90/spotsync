import { UseCase } from 'src/common/core/common.use-case';
import { AddSpotCommand } from '../commands/add-spot.command';

export const AddSpotUseCaseProvider = 'AddSpotUseCase';

export interface AddSpotUseCase
	extends UseCase<AddSpotCommand, Promise<void>> {}
