import { Pagination } from 'src/common/core/common.repository';
import { UseCase } from 'src/common/core/common.use-case';
import { GetSpotDto } from '../../out/dto/get-spot.dto';
import { ListSpotsCommand } from '../commands/list-spots.command';

export const ListSpotsUseCaseProvider = 'ListSPotsUseCase';

export interface ListSpotsUseCase
	extends UseCase<ListSpotsCommand, Promise<Pagination<GetSpotDto>>> {}
