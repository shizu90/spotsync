import { UseCase } from "src/common/core/common.use-case";
import { CreateSpotFolderDto } from "../../out/dto/create-spot-folder.dto";
import { CreateSpotFolderCommand } from "../commands/create-spot-folder.command";

export const CreateSpotFolderUseCaseProvider = "CreateSpotFolderUseCase";

export interface CreateSpotFolderUseCase extends UseCase<CreateSpotFolderCommand, Promise<CreateSpotFolderDto>> {}