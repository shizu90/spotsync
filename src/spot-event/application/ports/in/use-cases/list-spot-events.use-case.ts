import { Pagination } from 'src/common/core/common.repository';
import { UseCase } from 'src/common/core/common.use-case';
import { SpotEventDto } from '../../out/dto/spot-event.dto';
import { ListSpotEventsCommand } from '../commands/list-spot-events.command';

export const ListSpotEventsUseCaseProvider = 'ListSpotEventsUseCase';

export interface ListSpotEventsUseCase
	extends UseCase<ListSpotEventsCommand, Promise<Pagination<SpotEventDto> | Array<SpotEventDto>>> {}
