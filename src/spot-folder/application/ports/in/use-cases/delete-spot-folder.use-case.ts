import { UseCase } from 'src/common/core/common.use-case';
import { DeleteSpotFolderCommand } from '../commands/delete-spot-folder.command';

export const DeleteSpotFolderUseCaseProvider = 'DeleteSpotFolderUseCase';

export interface DeleteSpotFolderUseCase
	extends UseCase<DeleteSpotFolderCommand, Promise<void>> {}
