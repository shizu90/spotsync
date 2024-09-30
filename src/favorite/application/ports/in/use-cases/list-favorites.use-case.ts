import { Pagination } from 'src/common/core/common.repository';
import { UseCase } from 'src/common/core/common.use-case';
import { FavoriteDto } from '../../out/dto/favorite.dto';
import { ListFavoritesCommand } from '../commands/list-favorites.command';

export const ListFavoritesUseCaseProvider = 'ListFavoritesUseCase';

export interface ListFavoritesUseCase
	extends UseCase<
		ListFavoritesCommand,
		Promise<Pagination<FavoriteDto> | Array<FavoriteDto>>
	> {}
