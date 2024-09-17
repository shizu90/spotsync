import { UseCase } from "src/common/core/common.use-case";
import { GetSpotFolderDto } from "../../out/dto/get-spot-folder.dto";
import { SortItemsCommand } from "../commands/sort-items.command";

export const SortItemsUseCaseProvider = "SortItemsUseCase";

export interface SortItemsUseCase extends UseCase<SortItemsCommand, Promise<GetSpotFolderDto>> {}