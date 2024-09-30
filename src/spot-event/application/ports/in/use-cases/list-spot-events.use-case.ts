import { UseCase } from 'src/common/core/common.use-case';
import { ListSpotEventsCommand } from '../commands/list-spot-events.command';

export const ListSpotEventsUseCaseProvider = 'ListSpotEventsUseCase';

export interface ListSpotEventsUseCase
	extends UseCase<ListSpotEventsCommand, Promise<void>> {}
