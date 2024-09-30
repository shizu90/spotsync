import { Pagination } from 'src/common/core/common.repository';
import { UseCase } from 'src/common/core/common.use-case';
import { SpotFolderDto } from '../../out/dto/spot-folder.dto';
import { ListSpotFoldersCommand } from '../commands/list-spot-folders.command';

export const ListSpotFoldersUseCaseProvider = 'ListSpotFoldersUseCase';

export interface ListSpotFoldersUseCase
	extends UseCase<
		ListSpotFoldersCommand,
		Promise<Pagination<SpotFolderDto> | Array<SpotFolderDto>>
	> {}
