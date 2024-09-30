import { UseCase } from 'src/common/core/common.use-case';
import { UpdateSpotFolderCommand } from '../commands/update-spot-folder.command';

export const UpdateSpotFolderUseCaseProvider = 'UpdateSpotFolderUseCase';

export interface UpdateSpotFolderUseCase
	extends UseCase<UpdateSpotFolderCommand, Promise<void>> {}
