import { Provider } from "@nestjs/common";
import { AddSpotUseCaseProvider } from "./application/ports/in/use-cases/add-spot.use-case";
import { CreateSpotFolderUseCaseProvider } from "./application/ports/in/use-cases/create-spot-folder.use-case";
import { DeleteSpotFolderUseCaseProvider } from "./application/ports/in/use-cases/delete-spot-folder.use-case";
import { FavoriteSpotFolderUseCaseProvider } from "./application/ports/in/use-cases/favorite-spot-folder.use.case";
import { GetSpotFolderUseCaseProvider } from "./application/ports/in/use-cases/get-spot-folder.use-case";
import { ListSpotFoldersUseCaseProvider } from "./application/ports/in/use-cases/list-spot-folders.use-case";
import { RemoveSpotUseCaseProvider } from "./application/ports/in/use-cases/remove-spot.use-case";
import { SortItemsUseCaseProvider } from "./application/ports/in/use-cases/sort-items.use-case";
import { UnfavoriteSpotFolderUseCaseProvider } from "./application/ports/in/use-cases/unfavorite-spot-folder.use-case";
import { UpdateSpotFolderUseCaseProvider } from "./application/ports/in/use-cases/update-spot-folder.use-case";
import { SpotFolderRepositoryProvider } from "./application/ports/out/spot-folder.repository";
import { AddSpotService } from "./application/services/add-spot.service";
import { CreateSpotFolderService } from "./application/services/create-spot-folder.service";
import { DeleteSpotFolderService } from "./application/services/delete-spot-folder.service";
import { FavoriteSpotFolderService } from "./application/services/favorite-spot-folder.service";
import { GetSpotFolderService } from "./application/services/get-spot-folder.service";
import { ListSpotFoldersService } from "./application/services/list-spot-folders.service";
import { RemoveSpotService } from "./application/services/remove-spot.service";
import { SortItemsService } from "./application/services/sort-items.service";
import { UnfavoriteSpotFolderService } from "./application/services/unfavorite-spot-folder.service";
import { UpdateSpotFolderService } from "./application/services/update-spot-folder.service";
import { SpotFolderRepositoryImpl } from "./infrastructure/adapters/out/spot-folder.db";

export const Providers: Provider[] = [
    {
        provide: GetSpotFolderUseCaseProvider,
        useClass: GetSpotFolderService,
    },
    {
        provide: ListSpotFoldersUseCaseProvider,
        useClass: ListSpotFoldersService,
    },
    {
        provide: CreateSpotFolderUseCaseProvider,
        useClass: CreateSpotFolderService,
    },
    {
        provide: SortItemsUseCaseProvider,
        useClass: SortItemsService,
    },
    {
        provide: DeleteSpotFolderUseCaseProvider,
        useClass: DeleteSpotFolderService,
    },
    {
        provide: AddSpotUseCaseProvider,
        useClass: AddSpotService,
    },
    {
        provide: RemoveSpotUseCaseProvider,
        useClass: RemoveSpotService,
    },
    {
        provide: FavoriteSpotFolderUseCaseProvider,
        useClass: FavoriteSpotFolderService,
    },
    {
        provide: UnfavoriteSpotFolderUseCaseProvider,
        useClass: UnfavoriteSpotFolderService,
    },
    {
        provide: UpdateSpotFolderUseCaseProvider,
        useClass: UpdateSpotFolderService,
    },
    {
        provide: SpotFolderRepositoryProvider,
        useClass: SpotFolderRepositoryImpl,
    }
];