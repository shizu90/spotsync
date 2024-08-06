import { UseCase } from 'src/common/core/common.use-case';
import { CreateSpotDto } from '../../out/dto/create-spot.dto';
import { CreateSpotCommand } from '../commands/create-spot.command';

export const CreateSpotUseCaseProvider = 'CreateSpotUseCase';

export interface CreateSpotUseCase
	extends UseCase<CreateSpotCommand, Promise<CreateSpotDto>> {}
