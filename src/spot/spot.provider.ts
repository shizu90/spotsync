import { Provider } from '@nestjs/common';
import { CreateSpotUseCaseProvider } from './application/ports/in/use-cases/create-spot.use-case';
import { DeleteSpotUseCaseProvider } from './application/ports/in/use-cases/delete-spot.use-case';
import { FavoriteSpotUseCaseProvider } from './application/ports/in/use-cases/favorite-spot.use-case';
import { GetSpotUseCaseProvider } from './application/ports/in/use-cases/get-spot.use-case';
import { ListSpotsUseCaseProvider } from './application/ports/in/use-cases/list-spots.use-case';
import { UnfavoriteSpotUseCaseProvider } from './application/ports/in/use-cases/unfavorite-spot.use-case';
import { UnvisitSpotUseCaseProvider } from './application/ports/in/use-cases/unvisit-spot.use.case';
import { UpdateSpotUseCaseProvider } from './application/ports/in/use-cases/update-spot.use-case';
import { VisitSpotUseCaseProvider } from './application/ports/in/use-cases/visit-spot.use.case';
import { SpotRepositoryProvider } from './application/ports/out/spot.repository';
import { CreateSpotService } from './application/services/create-spot.service';
import { DeleteSpotService } from './application/services/delete-spot.service';
import { FavoriteSpotService } from './application/services/favorite-spot.service';
import { GetSpotService } from './application/services/get-spot.service';
import { ListSpotsService } from './application/services/list-spots.service';
import { UnfavoriteSpotService } from './application/services/unfavorite-spot.service';
import { UnvisitSpotService } from './application/services/unvisit-spot.service';
import { UpdateSpotService } from './application/services/update-spot.service';
import { VisitSpotService } from './application/services/visit-spot.service';
import { SpotRepositoryImpl } from './infrastructure/adapters/out/spot.db';

export const Providers: Provider[] = [
	{
		provide: ListSpotsUseCaseProvider,
		useClass: ListSpotsService,
	},
	{
		provide: GetSpotUseCaseProvider,
		useClass: GetSpotService,
	},
	{
		provide: CreateSpotUseCaseProvider,
		useClass: CreateSpotService,
	},
	{
		provide: UpdateSpotUseCaseProvider,
		useClass: UpdateSpotService,
	},
	{
		provide: DeleteSpotUseCaseProvider,
		useClass: DeleteSpotService,
	},
	{
		provide: FavoriteSpotUseCaseProvider,
		useClass: FavoriteSpotService,
	},
	{
		provide: UnfavoriteSpotUseCaseProvider,
		useClass: UnfavoriteSpotService,
	},
	{
		provide: VisitSpotUseCaseProvider,
		useClass: VisitSpotService,
	},
	{
		provide: UnvisitSpotUseCaseProvider,
		useClass: UnvisitSpotService,
	},
	{
		provide: SpotRepositoryProvider,
		useClass: SpotRepositoryImpl,
	},
];