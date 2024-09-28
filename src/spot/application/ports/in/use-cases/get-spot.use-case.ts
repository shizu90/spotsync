import { UseCase } from 'src/common/core/common.use-case';
import { SpotDto } from '../../out/dto/spot.dto';
import { GetSpotCommand } from '../commands/get-spot.command';

export const GetSpotUseCaseProvider = 'GetSpotUseCase';

export interface GetSpotUseCase
	extends UseCase<GetSpotCommand, Promise<SpotDto>> {}
