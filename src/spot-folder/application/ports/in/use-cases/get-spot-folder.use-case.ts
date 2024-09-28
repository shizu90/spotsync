import { UseCase } from "src/common/core/common.use-case";
import { SpotFolderDto } from "../../out/dto/spot-folder.dto";
import { GetSpotFolderCommand } from "../commands/get-spot-folder.command";

export const GetSpotFolderUseCaseProvider = "GetSpotFolderUseCase";

export interface GetSpotFolderUseCase extends UseCase<GetSpotFolderCommand, Promise<SpotFolderDto>> {}