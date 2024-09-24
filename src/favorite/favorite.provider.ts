import { Provider } from "@nestjs/common";
import { FavoriteUseCaseProvider } from "./application/ports/in/use-cases/favorite.use-case";
import { ListFavoritesUseCaseProvider } from "./application/ports/in/use-cases/list-favorites.use-case";
import { UnfavoriteUseCaseProvider } from "./application/ports/in/use-cases/unfavorite.use-case";
import { FavoriteService } from "./application/services/favorite.service";
import { ListFavoritesService } from "./application/services/list-favorites.service";
import { UnfavoriteService } from "./application/services/unfavorite.service";

export const Providers: Provider[] = [
    {
        provide: FavoriteUseCaseProvider,
        useClass: FavoriteService,
    },
    {
        provide: UnfavoriteUseCaseProvider,
        useClass: UnfavoriteService,
    },
    {
        provide: ListFavoritesUseCaseProvider,
        useClass: ListFavoritesService,
    }
];