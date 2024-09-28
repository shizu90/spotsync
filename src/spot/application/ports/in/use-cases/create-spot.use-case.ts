import { UseCase } from 'src/common/core/common.use-case';
import { SpotDto } from '../../out/dto/spot.dto';
import { CreateSpotCommand } from '../commands/create-spot.command';

export const CreateSpotUseCaseProvider = 'CreateSpotUseCase';

export interface CreateSpotUseCase
	extends UseCase<CreateSpotCommand, Promise<SpotDto>> {}
