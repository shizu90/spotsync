import { UseCase } from 'src/common/core/common.use-case';
import { FavoriteSpotCommand } from '../commands/favorite-spot.command';

export const FavoriteSpotUseCaseProvider = 'FavoriteSpotUseCase';

export interface FavoriteSpotUseCase
	extends UseCase<FavoriteSpotCommand, Promise<void>> {}
