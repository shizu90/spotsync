import { Pagination } from 'src/common/core/common.repository';
import { UseCase } from 'src/common/core/common.use-case';
import { SpotDto } from '../../out/dto/spot.dto';
import { ListSpotsCommand } from '../commands/list-spots.command';

export const ListSpotsUseCaseProvider = 'ListSPotsUseCase';

export interface ListSpotsUseCase
	extends UseCase<ListSpotsCommand, Promise<Pagination<SpotDto> | Array<SpotDto>>> {}
