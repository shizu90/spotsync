import { UseCase } from 'src/common/core/common.use-case';
import { UpdateSpotCommand } from '../commands/update-spot.command';

export const UpdateSpotUseCaseProvider = 'UpdateSpotUseCase';

export interface UpdateSpotUseCase
	extends UseCase<UpdateSpotCommand, Promise<void>> {}
