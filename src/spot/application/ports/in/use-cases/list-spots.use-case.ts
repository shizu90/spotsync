import { UseCase } from 'src/common/core/common.use-case';
import { ListSpotsCommand } from '../commands/list-spots.command';

export const ListSpotsUseCaseProvider = 'ListSPotsUseCase';

export interface ListSpotsUseCase
	extends UseCase<ListSpotsCommand, Promise<ListSpotsCommand>> {}
