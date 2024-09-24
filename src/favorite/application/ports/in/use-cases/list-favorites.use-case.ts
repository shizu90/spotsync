import { Pagination } from "src/common/core/common.repository";
import { UseCase } from "src/common/core/common.use-case";
import { GetFavoriteDto } from "../../out/dto/get-favorite.dto";
import { ListFavoritesCommand } from "../commands/list-favorites.command";

export const ListFavoritesUseCaseProvider = "ListFavoritesUseCase";

export interface ListFavoritesUseCase extends UseCase<ListFavoritesCommand, Promise<Pagination<GetFavoriteDto> | Array<GetFavoriteDto>>> {}